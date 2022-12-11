const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Create a job post
// @route   POST api/jobs
// @access  Private
exports.createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    description,
    industry,
    contact_email,
    employment,
  } = req.body;

  // Fetching the logged in profile name in order to add it as author
  const userProfile = await User.findById(req.user.id);

  const newJob = new Job({
    user: req.user.id,
    author: userProfile.name,
    title,
    company,
    location,
    description,
    industry,
    contact_email,
    employment,
  });

  const job = await newJob.save();

  res.json(job);
});

// @desc    Get the list of jobs
// @route   GET api/jobs
// @access  Private
exports.getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Delete user job post
// @route   DELETE api/jobs/:id
// @access  Private
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!Job) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Check user
  if (job.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await job.remove();
  res.json({ msg: "Job post was removed" });
});
