const express = require("express");
const {
  createCollectionRequest,
  getCollectionRequests,
  getUserCollectionRequests,
  updateCollectionStatus,
} = require("../controllers/collectionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public / User routes
router.post("/", createCollectionRequest);
router.get("/user", protect, getUserCollectionRequests);

// Admin routes
router.get("/admin/all", protect, adminOnly, getCollectionRequests);
router.put("/admin/:id/status", protect, adminOnly, updateCollectionStatus);

module.exports = router;