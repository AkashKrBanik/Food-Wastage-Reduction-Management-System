const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const authenticateUser = require("../middleware/auth");
const Request = require("../models/Request");
const Notification = require("../models/Notif");
const cloudinary = require('cloudinary').v2;
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const path = require("path");



router.post("/requests", async (req, res) => {
  try {
    const { userMail } = req.body;
    console.log("email:", userMail);
    const requests = await Request.find({ donorMail: userMail });
    console.log("requests", requests);
    const claimed = requests.filter((item) => item.status === "Accepted");
    const available = requests.filter((item) => item.status === "Pending");
    console.log("claimed", claimed);
    console.log("available", available);
    res.status(200).json({ claimed, available });
  } catch (error) { }
});

router.post("/requestDonation", async (req, res) => {
  try {
    const { userMail, donorMail, foodItemId, requestedQuantity, message } =
      req.body;

    if (!userMail || !foodItemId || !requestedQuantity || !donorMail) {
      console.log("error here ");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRequest = new Request({
      userMail,
      donorMail,
      foodItemId,
      requestedQuantity,
      message,
    });
    await newRequest.save();
    res.status(201).json({ success: true, message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error requesting donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// module.exports = router;

// Add food (Only for logged-in users)
router.post("/add", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { title, foodItem, quantity, description, location, expiryDate, donorMail } =
      req.body;
    const file = req.file;
    console.log("File:", file);
    if (!file) {
      console.log("File not found in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", file.filename);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
    const uploadFile = await cloudinary.uploader.upload(filePath, {
      folder: "food_images",
      use_filename: true,
      unique_filename: false,
    }).catch((err) => {
      console.error("Error uploading file to Cloudinary:", err);
      return res.status(500).json({ error: "Error uploading file" });
    });

    const imageUrl = uploadFile.secure_url;

    const newFood = new Food({
      donorId: req.user?.id,
      donorName: req.user.name,
      title,
      donorMail,
      foodItem,
      description,
      quantity,
      location,
      expiryDate,
      images: imageUrl,
    });
    await newFood.save();
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

router.get("/getItem/:id", async (req, res) => {
  try {
    const foodItem = await Food.find({ _id: req.params.id });
    res.status(200).json(foodItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all available food
router.post("/", async (req, res) => {
  const { mail } = req.body;
  try {
    const foodItems = await Food.find({
      status: "Available",
      donorMail: { $ne: mail },
    });

    res.status(200).json(foodItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Claim food
router.post("/acceptReq", authenticateUser, async (req, res) => {
  try {

    const { id, mail } = req.body;

    const foodItem = await Food.findById({ _id: id });

    if (!foodItem || foodItem.status !== "Available") {
      console.log("Returned from line no. /claim > 107");
      return res.status(404).json({ message: "Food not available" });
    }

    const freq = await Request.findOne({ foodItemId: id });

    foodItem.status = "Claimed";
    foodItem.claimedBy = mail;
    await foodItem.save();
    freq.status = "Accepted";
    await freq.save();
    const notification = new Notification({
      title: "Food Claimed",
      recipient: freq.userMail,
      message: `Your request for ${foodItem.foodItem} has been accepted.`,
    });
    await notification.save();
    res.status(200).json({ message: "Food claimed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/rejectReq", authenticateUser, async (req, res) => {

  try {
    const { id, mail } = req.body;

    const freq = await Request.findOne({ foodItemId: id });
    if (!freq) {
      return res.status(404).json({ message: "Request not found" });
    }
    freq.status = "Rejected";
    await freq.save();
    const notification = new Notification({
      title: "Request Rejected",
      recipient: freq.userMail,
      message: `Your request for ${freq.foodItemId} has been rejected.`,
    });
    await notification.save();
    res.status(200).json({ message: "Request rejected successfully" });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
