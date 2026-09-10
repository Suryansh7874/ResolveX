const express = require("express");

const {getDashboard} = require("../controllers/officerController");
const {getOfficerIssueDetails} = require("../controllers/officerIssueController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware,roleMiddleware("OFFICER"),getDashboard);

router.get(
    "/issues/:issueId",
    authMiddleware,
    roleMiddleware("OFFICER"),
    getOfficerIssueDetails,
);

module.exports= router;