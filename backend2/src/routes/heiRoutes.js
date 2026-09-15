const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createHEI,
  getHEIs,
  getAssignedChallenges,
  acceptAssignedChallenge,
  rejectAssignedChallenge,
} = require("../controllers/heiController");

const router = express.Router();

// ==========================================
// CREATE HEI
// ==========================================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  createHEI
);
// ==========================================
// GET ALL HEIs
// ==========================================
router.get("/", getHEIs);



// ==========================================
// GET ASSIGNED CHALLENGES FOR HEI_ADMIN
// ==========================================
router.get(
  "/assigned",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  getAssignedChallenges
);

// ==========================================
// ACCEPT ASSIGNED CHALLENGE
// ==========================================

router.patch(
  "/:challengeId/accept",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  acceptAssignedChallenge
);

// ==========================================
// REJECT ASSIGNED CHALLENGE
// ==========================================

router.patch(
  "/:challengeId/reject",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  rejectAssignedChallenge
);

module.exports = router;