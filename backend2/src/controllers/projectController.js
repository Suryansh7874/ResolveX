const Project = require("../models/Project");
const Proposal = require("../models/Proposal");
const Challenge = require("../models/Challenge");
const ProjectTeam = require("../models/ProjectTeam");
const createNotification = require("../utils/createNotification");


const createProject = async (req, res) => {
  try {
    const {
      proposalId,
      facultyMentor,
      startDate,
      endDate,
    } = req.body;

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

    // 7. Update challenge status
    challenge.status = "IN_PROJECT";
    await challenge.save();
    team.status = "ACTIVE";
    await team.save();

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

    //  Trigger Notification for the Faculty Mentor
    await createNotification({
      userId: facultyMentor,
      type: "project_created",
      message: `You have been assigned as Faculty Mentor for project "${project.title}".`,
      projectId: project._id,
      challengeId: proposal.challengeId,
      proposalId: proposal._id,
    });

    //  Trigger Notification for the original challenge creator
    await createNotification({
      userId: challenge.submittedBy,
      type: "project_created",
      message: `A project has officially started for your challenge "${challenge.title}"!`,
      projectId: project._id,
      challengeId: proposal.challengeId,
    });

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

module.exports = {
  createProject,
};