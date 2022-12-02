require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const connectDB = require("./config/db");
const cookieSession = require("cookie-session");
// require("./models/User");
require("./services/passport");

const app = express();
app.use(cors());

// Init Middleware
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIEKEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect Database
connectDB();

// Look inside public folder to look for static files such as css, images etc.
app.use("/", express.static(path.join(__dirname, "public")));

// Define Routes
app.use("/", require("./routes/root"));
// Google auth routes
require("./routes/api/authRoutes")(app);
// Jobs routes
require("./routes/api/jobRoutes")(app);
// profiles routes
require("./routes/api/profileRoute.js")(app);

// Catch all the routes that reaches here after fail to match the routes above
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
