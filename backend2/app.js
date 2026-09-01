const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./src/routes/authRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const issueRoutes = require("./src/routes/issueRoutes");
const userRoutes = require("./src/routes/userRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const voiceRoute = require("./src/routes/voiceRoute");


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/departments", departmentRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/users", userRoutes);
app.use("/api/voice", voiceRoute);
app.use("/uploads", express.static("uploads"));


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Civic Issue Tracker API is running",
  });
});

  // HTTP 200 means:  Successful request.


module.exports = app;