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

// Validate required fields ->description & category
        if (!description || !category) {
            return res.status(400).json({
                message: "Description and category are required"
            });
        }

//Evaluate department based on category
        let department;
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


//Validating latitude and longitude values
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
            message: "Location is required"
        });
}

//Validating image file
        if (!req.files || !req.files.image) {
                return res.status(400).json({
                    message: "Issue image is required"
                });
            }

            const media = [];

// Add image
            if (req.files.image) {
                media.push({
                    type: "image",
                    url: `/uploads/${req.files.image[0].filename}`
                });
            }

// Add video if provided
            if (req.files.video) {
                media.push({
                    type: "video",
                    url: `/uploads/${req.files.video[0].filename}`
                });
            }

//Creating the issue
        const issue = await Issue.create({
            description,
            category,
            
            media,

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
            message: "Server error!! Issue not created"
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
            message: `Failed to fetch issues of ${department} department`,
            error: error.message
        });
    }
};

const updateIssue = async (req,res) => {

    try {
        const {id} = req.params;
        const {status, priority} = req.body;
        const issue = await Issue.findById(id);
        const Notification = require("../models/Notification");

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found Please try again!!"
            });
        }

        if (status !== undefined) {
            issue.status = status;  //Updating the issue status

            await Notification.create({
                userId: issue.userId,
                issueId: issue._id,
                message: `Your issue status has been updated to ${status}`,
                type: status === "resolved"
                    ? "issue_resolved"
                    : "status_updated"
            });

        }

        if(priority !== undefined) {
            issue.priority = priority;   //Updating priority
        }

        if(status==="resolved") {
            issue.resolvedAt= new Date();  //Recording the date&time when issue is resolved
        }
        await issue.save();        

        res.status(200).json({
            message: "Issue updated successfully",
            issue
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update issue , Please try Again!!",
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
            message: "Failed to fetch your issues, Please try Again!1",
            error: error.message
        });
    }
};

const getIssueById = async (req, res) => {
    try {

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found, Please try Again!!"
            });
        }

        res.status(200).json({
            issue
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch issue, Please try Again",
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
        if(description !== undefined) {
            issue.description = description;
        }

        if(category !== undefined) {
            issue.category = category;
        }
        await issue.save();

        res.status(200).json({
            message: "Hurray!! Issue updated successfully",
            issue
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update issue, Please try Again!!",
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
            message: "Hurray!! Issue deleted successfully"
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