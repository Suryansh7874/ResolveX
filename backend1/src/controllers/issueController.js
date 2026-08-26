const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
    try {
        const {
            description,
            category,
            latitude,
            longitude,
            priority,
            userId,
        } = req.body;

        // Validate required fields
        if (!description || !category) {
            return res.status(400).json({
                message: "Description and category are required"
            });
        }

        //Evaluate department based on category
        let departmentName;
        if (
            category === "pothole" ||
            category === "damaged_road"
        ) {
            department = "Public Works";
        }

        else if (category === "garbage" ||
                category === "fallen_tree")
        {
            department = "Municipal";
        }
        else if (
            category === "streetlight" ||
            category === "electrical_hazard"
        ) {
            department = "Electrical";
        }

        else {
            department = "Other";
        }

        

//Checking latitude and longitude values
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
            message: "Location is required"
        });
}
//Checking image file
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
            priority:priority||"medium",

            userId:userId||null,

            department
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
const getDepartmentIssues = async (req, res) => {
    try {
        const { department } = req.query;

        const issues = await Issue.find({
            department: department
        });

        res.status(200).json({
            count: issues.length,
            issues
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch issues",
            error: error.message
        });
    }
};
module.exports = {
    createIssue,
    getDepartmentIssues
};