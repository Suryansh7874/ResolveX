const express = require("express");
const router = express.Router();

const {
  createImpact,
  getImpact,
  updateImpact,
  verifyImpact,
} = require("../controllers/projectImpactController");

const authMiddleware = require("../middleware/authMiddleware");

// Create impact record
router.post(
  "/",
  authMiddleware,
  createImpact
);

// Get impact of a project
router.get(
  "/project/:projectId",
  authMiddleware,
  getImpact
);

// Update impact information
router.patch(
  "/:id",
  authMiddleware,
  updateImpact
);

// Government verifies impact
router.patch(
  "/:id/verify",
  authMiddleware,
  verifyImpact
);

module.exports = router;