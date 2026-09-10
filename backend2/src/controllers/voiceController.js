const { transcribeAudio } = require("../services/voiceService");

const transcribeVoice = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required",
            });
        }

        const result = await transcribeAudio({
            buffer: req.file.buffer,
            mimetype: req.file.mimetype,
        });


        return res.status(200).json({
            success: true,
            message: "Audio transcribed successfully",
            title: result.title,
            description: result.description,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,

        });
    }
};


module.exports = {
    transcribeVoice,
};