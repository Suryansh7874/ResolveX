const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const issueRoutes = require("./routes/issueRoutes");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/departments", departmentRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/ai", aiRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Civic Issue Tracker API is running",
  });
});

  // HTTP 200 means:  Successful request.


module.exports = app;