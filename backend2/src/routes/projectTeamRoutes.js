const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProjectTeam,
  getProjectTeamById

} = require("../controllers/projectTeamController");

const router = express.Router();

// ==========================================
// CREATE PROJECT TEAM
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  createProjectTeam
);

router.get(
  "/:teamId",
  authMiddleware,
  getProjectTeamById
);
module.exports = router;