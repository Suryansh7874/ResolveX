// const express = require("express");
// const multer = require("multer");
// const Image = require("../models/Image");

// const router = express.Router();

// const upload = multer({
//     dest: "uploads/"
// });

// //Uploading an image
// router.post("/upload", upload.single("image"), async (req, res) => {
//     //Storing image in MongoDB
//     try {
//         console.log("REQ.FILE:", req.file);

//         const image = await Image.create({
//             imageUrl: `/uploads/${req.file.filename}`
//         });

//         console.log("MONGO DOCUMENT:", image);
//         res.status(201).json({
//             message: "Image uploaded successfully",
//             image
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: "Image upload failed",
//             error: error.message
//         });

//     }

// });

// module.exports = router;