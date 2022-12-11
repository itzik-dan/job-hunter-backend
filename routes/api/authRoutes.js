const express = require("express");
const router = express.Router();
// controllers
const { signUp, signIn } = require("../../controllers/authController");

router.post("/api/signup", signUp);

router.post("/api/signin", signIn);

module.exports = router;
