const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");



const {
  createIssue,
  getIssues,
  getDepartmentIssues,
  checkDuplicateIssue,
  upvoteIssue,
  updateIssueStatus,
  deleteMyIssue,
  assignIssue,
  getMyIssues,
  getIssueById
} = require("../controllers/issueController");

const router = express.Router();


router.post("/", authMiddleware, 
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 }
    ]), 
    createIssue
);

router.get("/", getIssues);

router.get("/department", getDepartmentIssues);     //filtering issues by department

router.post("/check-duplicate", authMiddleware, checkDuplicateIssue);

router.post("/:issueId/upvote", authMiddleware, upvoteIssue);

router.get("/:issueId", authMiddleware, getIssueById
);

router.get(
    "/my",
    authMiddleware,
    getMyIssues
);

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

router.delete(
    "/my/:issueId",
    authMiddleware,
    deleteMyIssue
);


module.exports = router;