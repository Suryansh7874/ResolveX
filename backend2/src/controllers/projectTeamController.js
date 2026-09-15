const Challenge = require("../models/Challenge");
const HEIMember = require("../models/HEIMember");
const ProjectTeam = require("../models/ProjectTeam");

const createProjectTeam = async (req, res) => {
  try {
    const {
      challengeId,
      name,
      description,
      facultyMembers = [],
      studentMembers = [],
    } = req.body;

    const heiId = req.user.heiId;

    if (!heiId) {
      return res.status(400).json({
        success: false,
        message: "HEI association not found",
      });
    }

    if (!challengeId || !name) {
      return res.status(400).json({
        success: false,
        message: "challengeId and team name are required",
      });
    }

    // -----------------------------------------
    // CHECK CHALLENGE
    // -----------------------------------------

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Challenge must be accepted by the HEI
    if (
      challenge.status !== "IN_PROJECT" ||
      challenge.heiAcceptance?.status !== "ACCEPTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Team can only be created for an accepted challenge",
      });
    }

    // Challenge must belong to this HEI
    if (
      !challenge.assignedHEI ||
      challenge.assignedHEI.toString() !== heiId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This challenge is not assigned to your HEI",
      });
    }

    // -----------------------------------------
    // CHECK EXISTING TEAM
    // -----------------------------------------

    const existingTeam = await ProjectTeam.findOne({
      challengeId,
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "A team already exists for this challenge",
      });
    }

    // -----------------------------------------
    // VALIDATE MEMBER ARRAYS
    // -----------------------------------------

    if (
      !Array.isArray(facultyMembers) ||
      !Array.isArray(studentMembers)
    ) {
      return res.status(400).json({
        success: false,
        message: "facultyMembers and studentMembers must be arrays",
      });
    }

    if (facultyMembers.length === 0 && studentMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one faculty or student member is required",
      });
    }

    // -----------------------------------------
    // GET ALL MEMBERS
    // -----------------------------------------

    const allMemberIds = [
      ...facultyMembers,
      ...studentMembers,
    ];

    const members = await HEIMember.find({
      _id: { $in: allMemberIds },
      heiId,
      isActive: true,
    });

    // Make sure every requested member exists
    if (members.length !== allMemberIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more selected members are invalid, inactive, or belong to another HEI",
      });
    }

    // -----------------------------------------
    // CHECK MEMBER TYPES
    // -----------------------------------------

    const facultySet = new Set(
      facultyMembers.map((id) => id.toString())
    );

    const studentSet = new Set(
      studentMembers.map((id) => id.toString())
    );

    for (const member of members) {
      const memberId = member._id.toString();

      if (
        facultySet.has(memberId) &&
        member.memberType !== "FACULTY"
      ) {
        return res.status(400).json({
          success: false,
          message: `${memberId} is not a faculty member`,
        });
      }

      if (
        studentSet.has(memberId) &&
        member.memberType !== "STUDENT"
      ) {
        return res.status(400).json({
          success: false,
          message: `${memberId} is not a student`,
        });
      }
    }

    // -----------------------------------------
    // CHECK DUPLICATE MEMBER IDs
    // -----------------------------------------

    if (new Set(allMemberIds.map((id) => id.toString())).size !== allMemberIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate team members are not allowed",
      });
    }

    // -----------------------------------------
    // CREATE TEAM
    // -----------------------------------------

    const team = await ProjectTeam.create({
      challengeId,
      heiId,
      createdBy: req.user.id,
      name,
      description: description || "",
      facultyMembers,
      studentMembers,
      status: "FORMING",
    });

    const populatedTeam = await ProjectTeam.findById(team._id)
      .populate({
        path: "challengeId",
        select: "title description domain status",
      })
      .populate({
        path: "heiId",
        select: "name type location",
      })
      .populate({
        path: "createdBy",
        select: "name email role",
      })
      .populate({
        path: "facultyMembers",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .populate({
        path: "studentMembers",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      });

    return res.status(201).json({
      success: true,
      message: "Project team created successfully",
      team: populatedTeam,
    });
  } catch (error) {
    console.error("Create project team error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project team",
      error: error.message,
    });
  }
};

// GET PROJECT TEAM BY ID
const getProjectTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await ProjectTeam.findById(teamId)
      .populate({
        path: "challengeId",
        select: "title description domain status assignedHEI",
      })
      .populate({
        path: "heiId",
        select: "name type location",
      })
      .populate({
        path: "createdBy",
        select: "name email role",
      })
      .populate({
        path: "facultyMembers",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .populate({
        path: "studentMembers",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Project team not found",
      });
    }

    // -----------------------------------------
    // ACCESS CONTROL
    // -----------------------------------------

    const isHEIAdmin =
      req.user.role === "HEI_ADMIN" &&
      req.user.heiId &&
      req.user.heiId.toString() === team.heiId._id.toString();

    const facultyMember = team.facultyMembers.some(
      (member) =>
        member.userId &&
        member.userId._id.toString() === req.user.id.toString()
    );

    const studentMember = team.studentMembers.some(
      (member) =>
        member.userId &&
        member.userId._id.toString() === req.user.id.toString()
    );

    if (!isHEIAdmin && !facultyMember && !studentMember) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project team",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Get project team error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project team",
      error: error.message,
    });
  }
};

module.exports = {
  createProjectTeam,
    getProjectTeamById,
};