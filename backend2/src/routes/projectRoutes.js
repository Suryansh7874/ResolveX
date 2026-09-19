const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProject,
  completeProject
} = require("../controllers/projectController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  createProject
);

router.patch(
  "/:projectId/complete",
  authMiddleware,
  roleMiddleware("GOVERNMENT"), // Restrict to Government users who verify the final work
  completeProject
);

module.exports = router;