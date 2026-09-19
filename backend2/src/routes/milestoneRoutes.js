const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createMilestone,
  getProjectMilestones,
  getMilestoneById,
  updateMilestone,
  startMilestone,
  submitMilestone,
  reviewMilestone,
  completeMilestone,
  deleteMilestone,
} = require("../controllers/milestoneController");

const router = express.Router();


// ==========================================
// GOVERNMENT
// ==========================================

// Create milestone
router.post(
  "/",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  createMilestone
);

// Update milestone
router.patch(
  "/:milestoneId",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  updateMilestone
);

// Delete milestone
router.delete(
  "/:milestoneId",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  deleteMilestone
);


// ==========================================
// GENERAL AUTHENTICATED USERS
// ==========================================

// Get all milestones of a project
router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectMilestones
);

// Get single milestone
router.get(
  "/:milestoneId",
  authMiddleware,
  getMilestoneById
);


// ==========================================
// HEI / FACULTY
// ==========================================

// Start milestone
router.patch(
  "/:milestoneId/start",
  authMiddleware,
  roleMiddleware("FACULTY"),
  startMilestone
);

// Submit milestone
router.patch(
  "/:milestoneId/submit",
  authMiddleware,
  roleMiddleware("FACULTY"),
  submitMilestone
);

// Review milestone
router.patch(
  "/:milestoneId/review",
  authMiddleware,
  roleMiddleware("FACULTY"),
  reviewMilestone
);

// Complete milestone
router.patch(
  "/:milestoneId/complete",
  authMiddleware,
  roleMiddleware("FACULTY"),
  completeMilestone
);


module.exports = router;