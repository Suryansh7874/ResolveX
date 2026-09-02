const Issue = require("../models/Issue");
const User = require("../models/User");

const { classifyIssueWithAI } = require("./aiControllers");


const createIssue = async(req,res) => {
    try{
        const {
            title, 
            description,
             location
        } = req.body;

const { latitude, longitude } = JSON.parse(location);



        const classification = await classifyIssueWithAI(
            title,
            description,
        );
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



        const issue = await Issue.create({
            reportedBy: req.user.userId,  // fetch from JWT authentication
            title,
            description,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            media,
            category: classification.category,
            priority: classification.priority,
            departmentId: classification.departmentId,           
                    
        });

        return res.status(201).json({
            success:true,
            message:"Issue created successfully",
            issue:issue,
        });


    }

    catch(error) {
        return res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};

// Get all issues controller

const getIssues = async(req,res) => {
    try{
        const issues = await Issue.find();
        return res.status(200).json({
            success:true,
            message:"Issues fetched successfully",
            issues:issues,
        });
    }

    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


// Get issues by department controller
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


//  check duplicates issues

const checkDuplicateIssue = async (req, res) => {
    try {
        const { category, location } = req.body;
        const { latitude, longitude } = location;

        const point = {
            type: "Point",
            coordinates: [longitude, latitude],
        };

        const potentialDuplicates = await Issue.find({
            category,
            location: {
                $near: {
                    $geometry: point,
                    $maxDistance: 50,
                },
            },
        });

        if (potentialDuplicates.length === 0) {
            return res.status(200).json({
                success: true,
                duplicate: false,
                message: "No duplicate issue found",
            });
        }

        return res.status(200).json({
            success: true,
            duplicate: true,
            message: "Potential duplicate issue found",
            potentialDuplicates,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Upvote issue controller

const upvoteIssue = async (req,res) => {

    try{
        const { issueId } = req.params;
        const userId = req.user.userId;
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        const alreadyUpvoted = issue.upvotedBy.includes(userId);

        if (alreadyUpvoted) {
            return res.status(400).json({
            success: false,
            message: "You have already upvoted this issue",
            });
        }

        issue.upvotedBy.push(userId);

        await issue.save();


        return res.status(200).json({
            success:true,
            message:"Issue upvoted successfully",
            upvotes: issue.upvotedBy.length,
            issue,
        });

    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

// Update issue status controller

const updateIssueStatus = async(req,res) => {
    try{
        const { issueId } = req.params;
        const {status} = req.body;

        const issue = await Issue.findById(issueId);

        if(!issue){
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        if(req.user.role !== "ADMIN"){
            if(req.user.role !== "OFFICER"){
                return res.status(403).json({
                    success:false,
                    message:"Only admin and officer can update the issue",

                });
            }

            if(!issue.assignedTo){
                return res.status(403).json({
                    success:false,
                    message:"You are not assigned for this issue",
                });
            }

            if(!(issue.assignedTo.equals(req.user.userId))){
                return res.status(403).json({
                    success:false,
                    message:"You are not assigned to this issue",
                });
            }
        }

        const allowedStatuses = [
            "REPORTED",
            "VERIFIED",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue status",
            });
        }

        issue.status = status;



        await issue.save();
        
        return res.status(200).json({
            success:true,
            message:"Status updated successfully",
            issue,

        });


    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//User deleting his own issue controller
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


// Assign issue controller


const assignIssue = async(req,res) => {
    try{
        const { issueId } = req.params;
        const {officerId} = req.body;

        const issue = await Issue.findById(issueId);

        if(!issue){
            return res.status(404).json({
                success:false,
                message:"Issue not found",
            });
        }

        const officer = await User.findById(officerId);

        if(!officer){
            return res.status(404).json({
                success:false,
                message:"Officer not found",
            });
        }

        // Now we need to make sure the user you found is actually an officer.

        if (officer.role !== "OFFICER") {
            return res.status(403).json({
                success: false,
                message: "User is not an officer",
            });
        }

if (!issue.departmentId || !officer.departmentId) {
    return res.status(400).json({
        success: false,
        message: "Issue or officer department is missing",
    });
}

if (!issue.departmentId.equals(officer.departmentId)) {
    return res.status(403).json({
        success: false,
        message: "Officer does not belong to this department",
    });
}

        issue.assignedTo=officer._id;

        issue.status = "ASSIGNED";

        await issue.save();
        return res.status(200).json({
            success:true,
            message:"Issue assigned successfully",
            issue,
        });
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

// get issues of the particlar user
const getMyIssues = async (req, res) => {
    try {
        const issues = await Issue.find({
            reportedBy: req.user.userId
        });

        return res.status(200).json({
            success: true,
            issues
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getIssueById = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await Issue.findById(issueId)
            .populate("reportedBy", "name email phone")
            .populate("departmentId", "departmentName code")
            .populate("assignedTo", "name email phone");

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        return res.status(200).json({
            success: true,
            issue
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getDepartmentIssues,
    checkDuplicateIssue,
    upvoteIssue,
    updateIssueStatus,
    deleteMyIssue,
    assignIssue,
    getMyIssues,
    getIssueById
};