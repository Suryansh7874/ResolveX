const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    createIssue
} = require("../controllers/issueController");

router.post("/",
    upload.single("image"),
    createIssue
);


module.exports = router;
