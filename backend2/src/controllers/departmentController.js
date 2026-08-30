const Department = require("../models/Department");

const createDepartment = async (req,res) => {
    try{
        const {departmentName, code, description} = req.body;

        const department =await Department.create({ 
            departmentName,
            code,
            description,
        });  // mongodb create 


        return res.status(201).json({
            success:true,
            message:"Department created successfully",
            department:department,
        });

    }


    catch(error) {
        return res.status(400).json({
            success:false,
            message:error.message,
        })

    }
};





const getDepartments = async (req,res) => {
    try{
        
        const departments = await Department.find();
        return res.status(200).json({
            success:true,
            message:"Departments fetched successfully",
            departments: departments,
        });
    }


    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


module.exports = {
    createDepartment,
    getDepartments,
};