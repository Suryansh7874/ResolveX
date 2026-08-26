const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    createIssue,
    getDepartmentIssues
} = require("../controllers/issueController");

router.post("/",
    upload.single("image"),
    createIssue
);
router.get("/", getDepartmentIssues);

module.exports = router;
