const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get currenlt signed in user
// @route   GET api/profile/me
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const profile = await User.findById(req.user._id).select("-password");
  console.log(profile);
  if (!profile) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(profile);
});

// @desc      Update single course
// @route     PATCH api/profile
// @access    Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, password, company, position, university, contact } = req.body;

  // Confirm data
  if (!name || !company || !position || !university || !contact) {
    res.status(400);
    throw new Error("All fields except password are required");
  }

  // Does the user exist to update?
  const user = await User.findById(req.user.id).exec();

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // Check for duplicate name
  const duplicate = await User.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Prevent updating to an existing user name
  if (duplicate && duplicate?._id.toString() !== req.user.id) {
    res.status(409);
    throw new Error("Duplicate username");
  }

  // Updating fields
  user.name = name;
  user.company = company;
  user.position = position;
  user.university = university;
  user.contact = contact;

  if (password) {
    // The userSchema.pre middleware will hash the password
    user.password = password;
  }

  const updatedUser = await user.save();

  res.status(200).json({ message: `${updatedUser.name} updated`, updatedUser });
});

// @Public_route    GET api/profile
// @Description     Get all profiles
// @access  Public
exports.getAllProfiles = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();

  // If no users
  if (!users?.length) {
    res.status(400);
    throw new Error("No users found");
  }

  res.json(users);
});

// @Private_route   DELETE api/profile
// @Description     Delete profile and jobs posted by him
// @access  Private
exports.deleteProfile = asyncHandler(async (req, res) => {
  // Deleting jobs that the user posted
  //   await Job.deleteMany({ user: req.user.id });
  // Remove profile
  await User.findByIdAndDelete(req.user.id);

  res.json({ msg: "Profile deleted" });
});
