// const Issue = require("../models/Issue");
// const User = require("../models/User");

const {findOfficer} = require("../services/officerService");

const getDashboard = async (req,res) =>{
    try{
        const officerId = req.user.userId;

        if(!officerId){
            return res.status(400).json({
                success:false,
                message:"Officer not found with this officerId"
            });
        }

        const dashboardData = await findOfficer(officerId);

        return res.status(200).json({
          success: true,
          message: "Officer dashboard fetched successfully",
          data: {
            officer: dashboardData.officer,
            issues: dashboardData.issues,
            low: dashboardData.low,
            medium: dashboardData.medium,
            high: dashboardData.high,
            critical: dashboardData.critical,
            resolved: dashboardData.resolved,
            inProgress: dashboardData.inProgress,
            assigned: dashboardData.assigned,
          },
        });



    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};

module.exports = {
    getDashboard,
};