const User = require("../models/User");
const Department = require("../models/Department");
const HEI = require("../models/HEI");


// =====================================================
// ADMIN CREATES MANAGED USER
// =====================================================

const createManagedUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      departmentId,
      heiId,
    } = req.body;


    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }


    // -------------------------------------------------
    // ALLOWED ROLES
    // -------------------------------------------------

    const allowedRoles = [
      "GOVERNMENT",
      "HEI_ADMIN",
      "FACULTY",
      "STUDENT",
      "INDUSTRY",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Admin can create GOVERNMENT, HEI_ADMIN, FACULTY, STUDENT or INDUSTRY accounts",
      });
    }


    // -------------------------------------------------
    // CHECK DUPLICATE EMAIL
    // -------------------------------------------------

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }


    // -------------------------------------------------
    // GOVERNMENT
    // -------------------------------------------------

    if (role === "GOVERNMENT") {

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          message: "departmentId is required for GOVERNMENT account",
        });
      }

      const departmentExist =
        await Department.findById(departmentId);

      if (!departmentExist) {
        return res.status(404).json({
          success: false,
          message: "Department does not exist",
        });
      }

      if (!departmentExist.isActive) {
        return res.status(400).json({
          success: false,
          message: "This department is inactive",
        });
      }
    }


    // -------------------------------------------------
    // HEI ADMIN / FACULTY / STUDENT
    // -------------------------------------------------

    if (
      role === "HEI_ADMIN" ||
      role === "FACULTY" ||
      role === "STUDENT"
    ) {

      if (!heiId) {
        return res.status(400).json({
          success: false,
          message: "heiId is required for this role",
        });
      }

      const heiExist = await HEI.findById(heiId);

      if (!heiExist) {
        return res.status(404).json({
          success: false,
          message: "HEI does not exist",
        });
      }

      if (!heiExist.isActive) {
        return res.status(400).json({
          success: false,
          message: "This HEI is inactive",
        });
      }
    }


    // -------------------------------------------------
    // CREATE USER ACCOUNT
    // -------------------------------------------------

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,

      departmentId:
        role === "GOVERNMENT"
          ? departmentId
          : null,

      heiId:
        role === "HEI_ADMIN" ||
        role === "FACULTY" ||
        role === "STUDENT"
          ? heiId
          : null,
    });


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: `${role} account created successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        departmentId: user.departmentId,
        heiId: user.heiId,
      },
    });

  } catch (error) {

    console.error("Create managed user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create managed user",
      error: error.message,
    });
  }
};



module.exports = {
  createManagedUser,
};