const mongoose = require("mongoose");
const requireLogin = require("../../middlewares/requireLogin");
const validObjectId = require("../../middlewares/validObjectId");
const { body, validationResult } = require("express-validator");

const Job = require("../../models/Job");
const Profile = require("../../models/Profile");

module.exports = (app) => {
	// Private_route:    POST api/jobs
	// Description:     Create a job post
	app.post(
		"/api/jobs",
		[
			requireLogin,
			[
				body("title", "title is required").not().isEmpty(),
				body("company", "company is required").not().isEmpty(),
				body("location", "location is required").not().isEmpty(),
				body("description", "description is required").not().isEmpty(),
				body("industry", "industry is required").not().isEmpty(),
				body("contact_email", "contact email is required")
					.not()
					.isEmpty(),
				body("employment", "employment is required").not().isEmpty(),
			],
		],
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			const {
				title,
				company,
				location,
				description,
				industry,
				contact_email,
				employment,
			} = req.body;

			try {
				// Fetching the logged in profile name in order to add it as author
				const profile = await Profile.findOne({user: req.user.id})

				const newJob = new Job({
					user: req.user.id,
					author: profile.name,
					title,
					company,
					location,
					description,
					industry,
					contact_email,
					employment			
				});

				const job = await newJob.save();

				res.json(job);
			} catch (err) {
				console.error(err.message);
				res.status(500).send("Server Error");
			}
		}
	);

	// Private_route:    GET api/jobs
	// Description:     Get the list of jobs
	app.get("/api/jobs", requireLogin, async (req, res) => {
		try {
			const jobs = await Job.find().sort({ date: -1 });
			res.json(jobs);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	});

	// Private_route:    DELETE api/jobs/:id
	// Description:     Delete a post
	app.delete("/api/jobs/:id", [requireLogin, validObjectId("id")], async (req, res) => {
		try {
			const job = await Job.findById(req.params.id);

			if (!Job) {
				return res.status(404).json({ msg: "Post not found" });
			}

			// Check user
			if (job.user.toString() !== req.user.id) {
				return res.status(401).json({ msg: "User not authorized" });
			}

			await job.remove();

			res.json({ msg: "Job post was removed" });
		} catch (err) {
			console.error(err.message);

			res.status(500).send("Server Error");
		}
	});

};
