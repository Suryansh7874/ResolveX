const Project = require("../models/Project");
const Proposal = require("../models/Proposal");
const Challenge = require("../models/Challenge");
const ProjectTeam = require("../models/ProjectTeam");
const Milestone = require("../models/Milestone"); // Added missing import
const createNotification = require("../utils/createNotification");

// ==========================================
// CREATE PROJECT
// ==========================================
const createProject = async (req, res) => {
  try {
    const { proposalId, facultyMentor, startDate, endDate } = req.body;

    if (!proposalId || !facultyMentor) {
      return res.status(400).json({
        success: false,
        message: "proposalId and facultyMentor are required",
      });
    }

    // 1. Find proposal
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // 2. Project can only be created from approved proposal
    if (proposal.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Project can only be created from an approved proposal",
      });
    }

    // 3. Prevent duplicate project
    const existingProject = await Project.findOne({
      proposalId: proposal._id,
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "Project already exists for this proposal",
      });
    }

    // 4. Verify challenge
    const challenge = await Challenge.findById(proposal.challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // 5. Verify team
    const team = await ProjectTeam.findById(proposal.teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Project team not found",
      });
    }

    // 6. Create project
    const project = await Project.create({
      challengeId: proposal.challengeId,
      proposalId: proposal._id,
      heiId: proposal.heiId,
      teamId: proposal.teamId,
      facultyMentor,
      title: proposal.title,
      description: proposal.proposedSolution,
      status: "PLANNED",
      startDate: startDate || new Date(),
      endDate: endDate || null,
    });

    // 7. Update states
    try {
      challenge.status = "IN_PROJECT";
      await challenge.save();

      team.status = "ACTIVE";
      await team.save();
    } catch (stateError) {
      // Manual Rollback if updating states fails
      await Project.findByIdAndDelete(project._id);
      throw stateError;
    }

    // 8. Return populated project
    const populatedProject = await Project.findById(project._id)
      .populate({
        path: "challengeId",
        select: "title domain status",
      })
      .populate({
        path: "proposalId",
        select: "title status",
      })
      .populate({
        path: "heiId",
        select: "name type location",
      })
      .populate({
        path: "teamId",
        select: "name description",
      })
      .populate({
        path: "facultyMentor",
        select: "name email role",
      });

    // 9. Trigger Notifications (Non-blocking)
    createNotification({
      userId: facultyMentor,
      type: "project_created",
      message: `You have been assigned as Faculty Mentor for project "${project.title}".`,
      projectId: project._id,
      challengeId: proposal.challengeId,
      proposalId: proposal._id,
    }).catch(console.error);

    createNotification({
      userId: challenge.submittedBy,
      type: "project_created",
      message: `A project has officially started for your challenge "${challenge.title}"!`,
      projectId: project._id,
      challengeId: proposal.challengeId,
    }).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// ==========================================
// COMPLETE PROJECT
// ==========================================
const completeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { finalRemarks } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Project is already marked as COMPLETED",
      });
    }

    // 1. Ensure all milestones exist and are approved
    const totalMilestones = await Milestone.countDocuments({ projectId });
    if (totalMilestones === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot complete project without any created milestones",
      });
    }

    const pendingMilestones = await Milestone.countDocuments({
      projectId,
      status: { $nin: ["APPROVED", "COMPLETED"] },
    });

    if (pendingMilestones > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot complete project. ${pendingMilestones} milestone(s) are still pending approval.`,
      });
    }

    // 2. Update Project
    project.status = "COMPLETED";
    project.completedAt = new Date();
    project.finalRemarks = finalRemarks || null;
    await project.save();

    // 3. Update Challenge to RESOLVED
    const challenge = await Challenge.findById(project.challengeId);
    if (challenge) {
      challenge.status = "RESOLVED";
      await challenge.save();

      // 4. Notify Citizen Submitter (Non-blocking)
      createNotification({
        userId: challenge.submittedBy,
        type: "challenge_resolved",
        message: `Great news! The challenge "${challenge.title}" has been officially resolved!`,
        challengeId: challenge._id,
        projectId: project._id,
      }).catch(console.error);
    }

    return res.status(200).json({
      success: true,
      message: "Project successfully completed and challenge marked as RESOLVED",
      project,
    });
  } catch (error) {
    console.error("Complete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete project",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  completeProject,
};