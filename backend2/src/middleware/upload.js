const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 50 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            // Images
            "image/jpeg",
            "image/jpg",
            "image/png",

            // Videos
            "video/mp4",
            "video/webm",

            // Documents
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only image, video and document files are allowed"
                )
            );
        }
    }
});

module.exports = upload;