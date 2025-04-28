const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  userMail: {
    type: String,
    ref: "User",
    required: true,
  },
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
    required: true,
  },
  donorMail: {
    type: String,
    ref: "User",
    required: true,
  },
  requestedQuantity: { type: Number, required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  requestDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);