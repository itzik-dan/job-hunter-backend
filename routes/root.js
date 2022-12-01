const express = require("express");
const router = express.Router();
const path = require("path");

// only match for only slash or /indet.html ^ means begin of the string $ means end of the string
router.get("^/$|/index(.html)?", (req, res) => {
  // Where to find the index.html
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
