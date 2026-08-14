const Collection = require("../models/Collection");

// Create collection request
const createCollectionRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      user: req.user ? req.user._id : undefined,
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

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
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