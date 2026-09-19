const express = require("express");
const router = express.Router();

const {
  getGovernmentDashboard,
  getHeiDashboard,
  getCitizenDashboard,
    getFacultyDashboard,
    getStudentDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Government Admin Dashboard (Government / System Admin)
router.get(
  "/government",
  authMiddleware,
  roleMiddleware("GOVERNMENT", "ADMIN"),
  getGovernmentDashboard
);

// HEI Admin / Faculty Dashboard
router.get(
  "/hei",
  authMiddleware,
  roleMiddleware("HEI_ADMIN", "FACULTY"),
  getHeiDashboard
);

// Faculty Dashboard
router.get(
  "/faculty",
  authMiddleware,
  roleMiddleware("FACULTY"),
  getFacultyDashboard
);

// Student Dashboard
router.get(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getStudentDashboard
);

// Public / Citizen Dashboard (No auth required, or accessible to all)
router.get("/citizen", getCitizenDashboard);

module.exports = router;