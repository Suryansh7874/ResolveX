const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProject,
} = require("../controllers/projectController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  createProject
);

module.exports = router;