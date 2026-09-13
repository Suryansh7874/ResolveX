const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createChallenge,
    getChallenges,
    checkDuplicateChallenge,
    supportChallenge,
    deleteMyChallenge,
    getMyChallenges,
    getChallengeById,
    matchChallengeWithHEIs,
    validateChallenge,
} = require("../controllers/challengeController");

const router = express.Router();


// ==========================================
// CREATE CHALLENGE
// ==========================================

router.post(
    "/",
    authMiddleware,

    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),

    createChallenge
);


// ==========================================
// GET ALL CHALLENGES
// ==========================================

router.get(
    "/",
    getChallenges
);


// ==========================================
// CHECK DUPLICATE CHALLENGE
// ==========================================

router.post(
    "/check-duplicate",
    authMiddleware,
    checkDuplicateChallenge
);

// ==========================================
// VALIDATE CHALLENGE
// ==========================================
router.patch(
  "/:challengeId/validate",
  authMiddleware,
  roleMiddleware("GOVERNMENT", "ADMIN"),
  validateChallenge
);

// ==========================================
// GET MY CHALLENGES
// ==========================================

router.get(
    "/my",
    authMiddleware,
    getMyChallenges
);


// ==========================================
// GET CHALLENGE BY ID
// ==========================================

router.get(
    "/:challengeId",
    authMiddleware,
    getChallengeById
);


// ==========================================
// SUPPORT A CHALLENGE
// ==========================================

router.post(
    "/:challengeId/support",
    authMiddleware,
    supportChallenge
);

// ==========================================
// MATCH CHALLENGE WITH HEIs
// ==========================================
router.get(
  "/:challengeId/matches",
  authMiddleware,
  matchChallengeWithHEIs
);

// ==========================================
// DELETE MY CHALLENGE
// ==========================================

router.delete(
    "/my/:challengeId",
    authMiddleware,
    deleteMyChallenge
);


module.exports = router;