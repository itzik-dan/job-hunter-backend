const mongoose = require("mongoose");
const requireLogin = require("../../middlewares/requireLogin");
const { body, validationResult } = require("express-validator");
const validObjectId = require("../../middlewares/validObjectId");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Job = require('../../models/Job');

module.exports = (app) => {
	// Private_route:   GET api/profile/me
	// Description:     Get current users profile
	app.get("/api/profile/me", requireLogin, async (req, res) => {
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			if (!profile) {
				return res
					.status(400)
					.json({ msg: "There is no profile for this user" });
			}

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	});

	// @Private_route    POST api/profile
	// @Description     Create or update user profile
	app.post(
		"/api/profile",
		[
			requireLogin,
			[
				body("name", "Name is required").not().isEmpty(),
				body("company", "Company is required").not().isEmpty(),
				body("position", "Position is required").not().isEmpty(),
				body("university", "University is required").not().isEmpty(),
				body("contact", "Contact is required").not().isEmpty(),
			],
		],
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			const { name, company, position, university, contact } = req.body;

			const profileFields = {
				user: req.user.id,
				name,
				company,
				position,
				university,
				contact,
			};
			try {
				// Using upsert option (creates new doc if no match is found):
				let profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true, upsert: true, setDefaultsOnInsert: true }
				);
				res.json(profile);
			} catch (err) {
				console.error(err.message);
				res.status(500).send("Server Error");
			}
		}
	);

	// @Public_route    GET api/profile
	// @Description     Get all profiles
	app.get("/api/profile", async (req, res) => {
		try {
			const profiles = await Profile.find();
			res.json(profiles);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	});

	// @Private_route    DELETE api/profile
	// @Description     Delete profile and jobs posted by him
	app.delete('/api/profile', requireLogin, async (req, res) => {
	  try {
	    // Deleting jobs that the user posted
	    await Job.deleteMany({ user: req.user.id });
	    // Remove profile
	    await Profile.findOneAndRemove({ user: req.user.id });

	    res.json({ msg: 'Profile deleted' });
	  } catch (err) {
	    console.error(err.message);
	    res.status(500).send('Server Error');
	  }
	});
};
