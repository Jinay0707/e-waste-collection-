const express = require("express");
const {
  registerUser,
  loginUser,
  adminLoginUser,
  forgotPassword,
  resetPassword,
  directResetPassword,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLoginUser);
router.post("/forgot-password", forgotPassword);
router.post("/direct-reset-password", directResetPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
