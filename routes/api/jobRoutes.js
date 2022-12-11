const express = require("express");
const { createJob, getAllJobs, deleteJob } = require("../../controllers/jobController");
const router = express.Router();
// require login middleware
const { protect } = require("../../middlewares/authMiddleware");

router.post("/api/jobs", protect, createJob);

router.get("/api/jobs", protect, getAllJobs);

router.delete("/api/jobs/:id", protect, deleteJob);

module.exports = router;
