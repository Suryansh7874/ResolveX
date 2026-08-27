const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");




const {
  createIssue,
  getIssues,
  checkDuplicateIssue,
  upvoteIssue,
  updateIssueStatus,
  assignIssue,
} = require("../controllers/issueController");

const router = express.Router();

router.post("/", authMiddleware, createIssue);

router.get("/", getIssues);

router.post("/check-duplicate", authMiddleware, checkDuplicateIssue);

router.post("/:issueId/upvote", authMiddleware, upvoteIssue);

router.post(
    "/:issueId/status",
    authMiddleware,
    roleMiddleware("ADMIN", "OFFICER"),  // only admin and assigned officer can change status
    updateIssueStatus
);

router.post(
    "/:issueId/assign",
    authMiddleware,
    roleMiddleware("ADMIN"),  // only admin can assign to officer
    assignIssue
);




module.exports = router;