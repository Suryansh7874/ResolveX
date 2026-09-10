const express = require("express");

const {
    testAI,
    classifyIssue,
} = require("../controllers/aiControllers");

const router = express.Router();

router.get("/test", testAI);

router.post("/classify", classifyIssue);

module.exports = router;