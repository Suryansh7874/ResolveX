const User = require("../models/User");
const HEI = require("../models/HEI");


// =====================================================
// GOVERNMENT/ADMIN CREATES MANAGED USER
// =====================================================

const createManagedUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
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
      "HEI_ADMIN",
      "FACULTY",
      "STUDENT",
      "INDUSTRY",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Admin/Government can create HEI_ADMIN, FACULTY, STUDENT or INDUSTRY accounts",
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