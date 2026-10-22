const express = require("express");
const {
  createCollectionRequest,
  getCollectionRequests,
  getUserCollectionRequests,
  updateCollectionStatus,
} = require("../controllers/collectionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public / User routes (both /api/collections and aliases)
router.post("/", createCollectionRequest);
router.get("/user", protect, getUserCollectionRequests);

// Admin collection routes
router.get("/admin/all", getCollectionRequests);
router.get("/admin/requests", getCollectionRequests);
router.put("/admin/:id/status", updateCollectionStatus);
router.put("/admin/requests/:id", updateCollectionStatus);

module.exports = router;
