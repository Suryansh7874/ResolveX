const express = require("express");

const {
    testAI,
    classifyChallenge,
} = require("../controllers/aiControllers");

const router = express.Router();

router.get("/test", testAI);

router.post("/classify", classifyChallenge);

module.exports = router;