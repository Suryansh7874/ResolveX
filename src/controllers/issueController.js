const Issue = require("../models/Issue");
const User = require("../models/User");

const { classifyIssueWithAI } = require("./aiControllers");


const createIssue = async(req,res) => {
    try{
        const {
            title, 
            description,
            //  category, 
            //  departmentId, 
             location, 
             media
        } = req.body;

        const { latitude, longitude } = location;



        const classification = await classifyIssueWithAI(
            title,
            description,
        );


        const issue = await Issue.create({
            reportedBy: req.user.userId,  // fetch from JWT authentication
            title,
            description,
            // category,
            // departmentId,
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



      






// console.log("ISSUE ID:", issue._id);
// console.log("ISSUE DEPARTMENT:", issue.departmentId);

// console.log("OFFICER ID:", officer._id);
// console.log("OFFICER DEPARTMENT:", officer.departmentId);















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




module.exports = {
    createIssue,
    getIssues,
    checkDuplicateIssue,
    upvoteIssue,
    updateIssueStatus,
    assignIssue,

};