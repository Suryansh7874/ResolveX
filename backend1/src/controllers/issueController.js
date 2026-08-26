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

        const { department, category } = req.query;

        const filter = {};

        if (department) {
            filter.department = department;
        }

        if (category) {
            filter.category = category;
        }

        const issues = await Issue.find(filter);

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
const updateIssue = async (req, res) => {

    try {

        const { id } = req.params;

        const { status, priority } = req.body;

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (status !== undefined) {
            issue.status = status;
        }

        if (priority !== undefined) {
            issue.priority = priority;
        }

        if (status === "resolved") {
            issue.resolvedAt = new Date();
        }

        await issue.save();

        res.status(200).json({
            message: "Issue updated successfully",
            issue
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update issue",
            error: error.message
        });

    }
};
const getMyIssues = async (req, res) => {
    try {

        const { userId } = req.query;

        const issues = await Issue.find({
            userId: userId
        });

        res.status(200).json({
            count: issues.length,
            issues
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch your issues",
            error: error.message
        });

    }
};
const getIssueById = async (req, res) => {
    try {

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.status(200).json({
            issue
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch issue",
            error: error.message
        });

    }
};
const updateMyIssue = async (req, res) => {

    try {

        const { id } = req.params;
        const { userId, description, category } = req.body;

        const issue = await Issue.findOne({
            _id: id,
            userId: userId
        });

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found or you are not authorized"
            });
        }

        if (description !== undefined) {
            issue.description = description;
        }

        if (category !== undefined) {
            issue.category = category;
        }

        await issue.save();

        res.status(200).json({
            message: "Issue updated successfully",
            issue
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update issue",
            error: error.message
        });

    }
};
const deleteMyIssue = async (req, res) => {

    try {

        const { id } = req.params;
        const { userId } = req.body;

        const issue = await Issue.findOneAndDelete({
            _id: id,
            userId: userId
        });

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found or you are not authorized"
            });
        }

        res.status(200).json({
            message: "Issue deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete issue",
            error: error.message
        });

    }
};
module.exports = {
    createIssue,
    getDepartmentIssues,
    updateIssue,
    getMyIssues,
    getIssueById,
    updateMyIssue,
    deleteMyIssue
};