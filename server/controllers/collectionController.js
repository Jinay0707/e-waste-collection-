const Collection = require("../models/Collection");
const User = require("../models/User");

// Create collection request
const createCollectionRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      user: req.user ? req.user._id : req.body.userId || undefined,
      name: req.body.name || (req.user ? req.user.name : "Guest User"),
      phone: req.body.phone || (req.user ? req.user.phone : ""),
      address: req.body.address || (req.user ? req.user.address : ""),
      city: req.body.city || "",
      eWasteType: req.body.eWasteType || req.body.deviceType || "General E-Waste",
      deviceType: req.body.deviceType || req.body.eWasteType || "E-Waste",
      brand: req.body.brand || "",
      model: req.body.model || "",
      quantity: String(req.body.quantity || 1),
      weight: String(req.body.weight || "1"),
      condition: req.body.condition || "working",
      pickupDate: req.body.pickupDate || "",
      pickupTime: req.body.pickupTime || "",
      specialInstructions: req.body.specialInstructions || "",
      estimatedPoints: req.body.estimatedPoints || 25,
      status: "Pending",
    };

    const collection = await Collection.create(requestData);

    res.status(201).json({
      success: true,
      message: "Collection request created successfully",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all collection requests (Admin)
const getCollectionRequests = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    // Format for frontend
    const formatted = collections.map((c) => ({
      _id: c._id,
      userName: c.name || (c.user ? c.user.name : "User"),
      userEmail: c.user ? c.user.email : "",
      userPhone: c.phone || (c.user ? c.user.phone : ""),
      deviceType: c.deviceType || c.eWasteType || "E-Waste",
      brand: c.brand || "",
      model: c.model || "",
      quantity: c.quantity || 1,
      weight: c.weight || "1 kg",
      condition: c.condition || "working",
      pickupDate: c.pickupDate || "",
      pickupTime: c.pickupTime || "",
      address: c.address || "",
      city: c.city || "",
      specialInstructions: c.specialInstructions || "",
      status: c.status || "Pending",
      estimatedPoints: c.estimatedPoints || 25,
      createdAt: c.createdAt,
      date: c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : "",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in user collection requests
const getUserCollectionRequests = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update collection request status (Admin)
const updateCollectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection request not found",
      });
    }

    // If status is completed and user exists, award points
    if (status === "Completed" && collection.user) {
      await User.findByIdAndUpdate(collection.user, {
        $inc: { rewardPoints: collection.estimatedPoints || 25 },
      });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status} successfully`,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCollectionRequest,
  getCollectionRequests,
  getUserCollectionRequests,
  updateCollectionStatus,
};
