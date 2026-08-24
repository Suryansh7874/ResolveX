const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Civic Issue Tracker API is running",
  });
});

  // HTTP 200 means:  Successful request.


module.exports = app;