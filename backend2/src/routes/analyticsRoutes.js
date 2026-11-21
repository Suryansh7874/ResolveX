const express = require("express");
const router = express.Router();

const {
  getOverviewAnalytics,
  // getChallengeAnalytics,
  // getProjectAnalytics,
  // getIndustryAnalytics,
  // getImpactAnalytics,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");

// Overall platform analytics
router.get(
  "/overview",
  authMiddleware,
  getOverviewAnalytics
);

// Challenge analytics
// router.get(
//   "/challenges",
//   authMiddleware,
//   getChallengeAnalytics
// );

// // Project analytics
// router.get(
//   "/projects",
//   authMiddleware,
//   getProjectAnalytics
// );

// // Industry collaboration analytics
// router.get(
//   "/industry",
//   authMiddleware,
//   getIndustryAnalytics
// );

// // Social impact analytics
// router.get(
//   "/impact",
//   authMiddleware,
//   getImpactAnalytics
// );

module.exports = router;