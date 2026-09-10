const express = require("express");

const { transcribeVoice } = require("../controllers/voiceController");

const upload = require("../middleware/audioUpload");

const router = express.Router();

router.post(
    "/transcribe",
    upload.single("audio"),
    transcribeVoice
);

module.exports = router;