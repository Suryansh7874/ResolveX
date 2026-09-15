const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProposal,
    submitProposal,
    reviewProposal,
} = require("../controllers/proposalController");

const router = express.Router();

// ==========================================
// CREATE PROPOSAL
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  createProposal
);

//==========================================
// SUBMIT PROPOSAL
// ==========================================
router.patch(
  "/:proposalId/submit",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  submitProposal
);

// ==========================================
// REVIEW PROPOSAL
// ==========================================
router.patch(
  "/:proposalId/review",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  reviewProposal
);

module.exports = router;