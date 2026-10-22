const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    eWasteType: {
      type: String,
      default: "Other",
    },
    deviceType: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    quantity: {
      type: String,
      default: "1",
    },
    weight: {
      type: String,
      default: "1",
    },
    condition: {
      type: String,
      default: "working",
    },
    pickupDate: {
      type: String,
      default: "",
    },
    pickupTime: {
      type: String,
      default: "",
    },
    specialInstructions: {
      type: String,
      default: "",
    },
    estimatedPoints: {
      type: Number,
      default: 25,
    },
    status: {
      type: String,
      default: "Pending", // Pending, Scheduled, In-Progress, Completed, Cancelled
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);
