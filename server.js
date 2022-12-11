require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Look inside public folder to look for static files such as css, images etc.
app.use("/", express.static(path.join(__dirname, "public")));

// Define Routes
app.use("/", require("./routes/root"));
// Auth routes
app.use(require("./routes/api/authRoutes"));
// Jobs routes
app.use(require("./routes/api/jobRoutes"));
// profiles routes
app.use(require("./routes/api/profileRoute.js"));

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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
