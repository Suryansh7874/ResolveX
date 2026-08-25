const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
    try {
        const {
            description,
            category,
            latitude,
            longitude,
            priority,
            userId
        } = req.body;

        if (!description || !category) {
            return res.status(400).json({
                message: "Description and category are required"
            });
        }

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
            message: "Location is required"
        });
}

        if (!req.file) {
            return res.status(400).json({
                message: "Issue image is required"
            });
        }

        const issue = await Issue.create({
            description,
            category,

            image: `/uploads/${req.file.filename}`,

            location: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            priority,
            userId:userId||null
        });

        res.status(201).json({
            message: "Issue created successfully",
            issue
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createIssue
};