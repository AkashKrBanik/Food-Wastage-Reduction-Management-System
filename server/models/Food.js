const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Stores donor's ID
  donorMail: { type: String, required: true },
  donorName: { type: String, required: true }, // Redundant but useful for quick access
  title: { type: String, required: true },
  foodItem: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  images: { type: String },
  claimedBy: { type: String, default: null },
  status: {
    type: String,
    enum: ["Available", "Claimed"],
    default: "Available",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Food", FoodSchema);
