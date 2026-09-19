const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./src/routes/authRoutes");

// const departmentRoutes = require("./src/routes/departmentRoutes");
// const issueRoutes = require("./src/routes/issueRoutes");

const challengeRoutes = require("./src/routes/challengeRoutes");
const userRoutes = require("./src/routes/userRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const voiceRoute = require("./src/routes/voiceRoute");

const notificationRoutes = require("./src/routes/notificationRoutes");
const heiMemberRoutes = require("./src/routes/heiMemberRoutes");
const heiRoutes = require("./src/routes/heiRoutes");

const projectTeamRoutes = require("./src/routes/projectTeamRoutes");
const proposalRoutes = require("./src/routes/proposalRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const milestoneRoutes = require("./src/routes/milestoneRoutes");
const projectDocumentRoutes = require("./src/routes/projectdocRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// app.use("/api/departments", departmentRoutes);
// app.use("/api/issues", issueRoutes);

app.use("/api/challenges", challengeRoutes);
app.use("/api/hei", heiRoutes);
app.use("/api/hei-members", heiMemberRoutes);


app.use("/api/project-teams", projectTeamRoutes); 
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/project-documents", projectDocumentRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/users", userRoutes);
app.use("/api/voice", voiceRoute);
app.use("/uploads", express.static("uploads"));

app.use("/api/notifications", notificationRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResolveX API is running",
  });
});

  // HTTP 200 means:  Successful request.


module.exports = app;