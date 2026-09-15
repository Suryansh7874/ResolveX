const HEI = require("../models/HEI");
const HEIMember = require("../models/HEIMember");
const User = require("../models/User");

// REGISTER FACULTY / STUDENT WITH AN HEI
const registerHEIMember = async (req, res) => {
  try {
    const {
      userId,
      memberType,
      designation,
      expertise,
      researchAreas,
      skills,
    } = req.body;

    // HEI ID comes from logged-in HEI Admin
    const heiId = req.user.heiId;

    if (!userId || !memberType) {
      return res.status(400).json({
        success: false,
        message: "userId & memberType are required",
      });
    }

    if (!heiId) {
      return res.status(403).json({
        success: false,
        message: "HEI is not assigned to this admin",
      });
    }

    // Only FACULTY or STUDENT can be registered
    if (!["FACULTY", "STUDENT"].includes(memberType)) {
      return res.status(400).json({
        success: false,
        message: "memberType must be FACULTY or STUDENT",
      });
    }

    // Check HEI
    const hei = await HEI.findById(heiId);

    if (!hei || !hei.isActive) {
      return res.status(404).json({
        success: false,
        message: "HEI not found or inactive",
      });
    }

    // Check user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User role must match member type
    if (user.role !== memberType) {
      return res.status(400).json({
        success: false,
        message: `User role is ${user.role}, but memberType is ${memberType}`,
      });
    }

    // Check if user is assigned to the same HEI
    if (user.heiId?.toString() !== heiId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This user is not assigned to your HEI",
      });
    }
    // Prevent duplicate membership
    const existingMember = await HEIMember.findOne({
      userId,
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "User is already associated with an HEI",
      });
    }

    // Create HEI member
    const member = await HEIMember.create({
      userId,
      heiId,
      memberType,
      designation:designation||null,
      expertise:expertise||[],
      researchAreas:researchAreas||[],
      skills:skills||[],
    });

    return res.status(201).json({
      success: true,
      message: `${memberType} registered with HEI successfully`,
      member,
    });
  } catch (error) {
    console.error("Register HEI member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register HEI member",
      error: error.message,
    });
  }
};

// GET MEMBERS OF AN HEI
const getHEIMembers = async (req, res) => {
  try {
    const { heiId } = req.params;
    const { memberType } = req.query;

    const filter = {
      heiId,
      isActive: true,
    };
    if (
      req.user.role === "HEI_ADMIN" &&
      req.user.heiId?.toString() !== heiId.toString()
    ) {
  return res.status(403).json({
    success: false,
    message: "You can only access members of your own HEI",
  });
}
    if (memberType) {
      filter.memberType = memberType;
    }

    const members = await HEIMember.find(filter)
      .populate("userId", "name email phone role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get HEI members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch HEI members",
      error: error.message,
    });
  }
};


module.exports = {
  registerHEIMember,
  getHEIMembers,
};