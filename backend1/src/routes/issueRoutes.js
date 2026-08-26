const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    createIssue,
    getDepartmentIssues,
    updateIssue,
    getMyIssues,
    getIssueById,
    updateMyIssue,
    deleteMyIssue
} = require("../controllers/issueController");

router.post("/",
    upload.single("image"),
    createIssue
);

router.get("/", getDepartmentIssues);

router.patch("/:id", updateIssue);

router.get("/my", getMyIssues);

router.get("/:id", getIssueById);

router.patch("/my/:id", updateMyIssue);

router.delete("/my/:id", deleteMyIssue);
module.exports = router;
