const express = require("express");
const router = express.Router();

const {
  createCollaboration,
  getProjectCollaborations,
  getCollaboration,
  updateCollaborationStatus,
  updateCollaboration,
  deleteCollaboration,
} = require("../controllers/industryCollaborationController");

const authMiddleware = require("../middleware/authMiddleware");

// Create collaboration request
router.post(
  "/",
  authMiddleware,
  createCollaboration
);

// Get all collaborations for a project
router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectCollaborations
);

// Get single collaboration
router.get(
  "/:id",
  authMiddleware,
  getCollaboration
);

// Accept / reject / activate / complete collaboration
router.patch(
  "/:id/status",
  authMiddleware,
  updateCollaborationStatus
);

// Update collaboration details
router.patch(
  "/:id",
  authMiddleware,
  updateCollaboration
);

// Delete / cancel collaboration
router.delete(
  "/:id",
  authMiddleware,
  deleteCollaboration
);

module.exports = router;