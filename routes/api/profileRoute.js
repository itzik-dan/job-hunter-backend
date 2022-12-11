const express = require("express");
const router = express.Router();
// require login middleware
const { protect } = require("../../middlewares/authMiddleware");

const {
  getUserProfile,
  updateUserProfile,
  getAllProfiles,
  deleteProfile,
} = require("../../controllers/profileController");

router.get("/api/profile/me", protect, getUserProfile);

router.patch("/api/profile", protect, updateUserProfile);

router.get("/api/profile", getAllProfiles);

router.delete("/api/profile", protect, deleteProfile);

module.exports = router;
