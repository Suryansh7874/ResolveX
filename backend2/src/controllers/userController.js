const User = require("../models/User");

const Department = require("../models/Department");

const promoteToOfficer = async (req,res) => {


    try{
    const {userId , departmentId} = req.body;

    if(!userId || !departmentId){
        return res.status(400).json({
            success:false,
            message:"userId and departmentId are required ",
        });
    }

    // user exist or not
    const userExist = await User.findById(userId);

    if(!userExist){
        return res.status(404).json({
            success:false,
            message:"User does not exist",
        });
    }


    if(userExist.role !== "CITIZEN"){
        return res.status(400).json({
            success:false,
            message:"You are already an Officer or an Admin"
        });
    }

    // department exist or not
    const departmentExist = await Department.findById(departmentId);

    if(!departmentExist){
        return res.status(404).json({
            success:false,
            message:"Department does not exist",
        });
    }


    // department is active or not 

    if(!departmentExist.isActive){
        return res.status(400).json({
            success:false,
            message:"This department is inactive. Sorry for inconvinience",
        });
    }

    // after all promote the user

    userExist.role = "OFFICER";
    userExist.departmentId = departmentExist._id;

    await userExist.save();




    return res.status(200).json({
        success: true,
        message: "User promoted to officer successfully",
        user: {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            phone: userExist.phone,
            role: userExist.role,
            departmentId: userExist.departmentId,
        },
    });
}

    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });       
    }




}


module.exports = {
    promoteToOfficer,
};