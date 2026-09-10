const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("audio/")) {
            cb(null, true);
        } else {
            cb(new Error("Only audio files are allowed"), false);
        }
    },
});

module.exports = upload;