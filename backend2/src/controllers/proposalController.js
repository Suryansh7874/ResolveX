const Challenge = require("../models/Challenge");
const ProjectTeam = require("../models/ProjectTeam");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const createNotification = require("../utils/createNotification");

// ==========================================
// CREATE PROPOSAL (DRAFT)
// ==========================================
const createProposal = async (req, res) => {
  try {
    const {
      challengeId,
      teamId,
      title,
      problemStatement,
      proposedSolution,
      objectives = [],
      methodology = "",
      expectedOutcomes = [],
      requiredTechnologies = [],
      estimatedDuration = null,
      requiredResources = [],
    } = req.body;

    const heiId = req.user.heiId;

    if (!heiId) {
      return res.status(400).json({
        success: false,
        message: "HEI association not found",
      });
    }

    if (
      !challengeId ||
      !teamId ||
      !title ||
      !problemStatement ||
      !proposedSolution
    ) {
      return res.status(400).json({
        success: false,
        message:
          "challengeId, teamId, title, problemStatement and proposedSolution are required",
      });
    }

    // -----------------------------------------
    // FIND CHALLENGE
    // -----------------------------------------
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // FIX: Verify HEI has accepted the challenge (Allow MATCHED or IN_PROJECT)
    if (challenge.heiAcceptance?.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "Proposal can only be created for an accepted challenge",
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
    // FIND TEAM
    // -----------------------------------------
    const team = await ProjectTeam.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Project team not found",
      });
    }

    if (team.heiId.toString() !== heiId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This team does not belong to your HEI",
      });
    }

    if (team.challengeId.toString() !== challengeId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team is not associated with this challenge",
      });
    }

    // -----------------------------------------
    // CHECK EXISTING PROPOSAL
    // -----------------------------------------
    const existingProposal = await Proposal.findOne({ challengeId });

    if (existingProposal) {
      return res.status(409).json({
        success: false,
        message: "A proposal already exists for this challenge",
      });
    }

    // -----------------------------------------
    // CREATE PROPOSAL
    // -----------------------------------------
    const proposal = await Proposal.create({
      challengeId,
      teamId,
      heiId,
      submittedBy: req.user.id || req.user._id,
      title,
      problemStatement,
      proposedSolution,
      objectives,
      methodology,
      expectedOutcomes,
      requiredTechnologies,
      estimatedDuration,
      requiredResources,
      status: "DRAFT",
    });

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate({
        path: "challengeId",
        select: "title description domain status",
      })
      .populate({
        path: "teamId",
        select: "name description facultyMembers studentMembers",
      })
      .populate({
        path: "heiId",
        select: "name type location",
      })
      .populate({
        path: "submittedBy",
        select: "name email role",
      });

    // Trigger Notification
    createNotification({
      userId: req.user.id || req.user._id,
      type: "proposal_created",
      message: `Draft proposal "${title}" has been successfully created.`,
      proposalId: proposal._id,
      challengeId,
    }).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Proposal created successfully",
      proposal: populatedProposal,
    });
  } catch (error) {
    console.error("Create proposal error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create proposal",
      error: error.message,
    });
  }
};

// ==========================================
// SUBMIT PROPOSAL
// ==========================================
const submitProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.heiId.toString() !== req.user.heiId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to submit this proposal",
      });
    }

    if (
      proposal.status !== "DRAFT" &&
      proposal.status !== "REVISION_REQUIRED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only draft or revision-required proposals can be submitted",
      });
    }

    proposal.status = "SUBMITTED";
    await proposal.save();

    // Cleaned up populate paths
    await proposal.populate([
      { path: "teamId", select: "name status" },
      { path: "heiId", select: "name type location" },
      { path: "submittedBy", select: "name email role" },
      { path: "challengeId", select: "title domain status submittedBy" },
    ]);

    const submitterId = proposal.submittedBy._id || proposal.submittedBy;

    // Trigger Notifications
    createNotification({
      userId: submitterId,
      type: "proposal_submitted",
      message: `Your proposal for challenge "${proposal.challengeId.title}" has been submitted for review.`,
      proposalId: proposal._id,
      challengeId: proposal.challengeId._id,
    }).catch(console.error);

    if (proposal.challengeId?.submittedBy) {
      createNotification({
        userId: proposal.challengeId.submittedBy,
        type: "proposal_submitted",
        message: `A new proposal has been submitted for your challenge "${proposal.challengeId.title}".`,
        proposalId: proposal._id,
        challengeId: proposal.challengeId._id,
      }).catch(console.error);
    }

    return res.status(200).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Submit proposal error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit proposal",
      error: error.message,
    });
  }
};

// ==========================================
// REVIEW PROPOSAL (WITH AUTOMATED PROJECT KICKOFF)
// ==========================================
const reviewProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, remarks, facultyMentor, startDate, endDate } = req.body;

    const allowedStatuses = ["APPROVED", "REJECTED", "REVISION_REQUIRED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid review status. Use APPROVED, REJECTED, or REVISION_REQUIRED",
      });
    }

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (
      proposal.status !== "SUBMITTED" &&
      proposal.status !== "UNDER_REVIEW"
    ) {
      return res.status(400).json({
        success: false,
        message: "Proposal is not available for review",
      });
    }

    const previousStatus = proposal.status;

    // -----------------------------------------
    // HANDLE REJECTED / REVISION_REQUIRED
    // -----------------------------------------
    if (status !== "APPROVED") {
      proposal.status = status;
      proposal.review = {
        reviewedBy: req.user.id || req.user._id,
        reviewedAt: new Date(),
        remarks: remarks || null,
      };
      await proposal.save();

      await proposal.populate([
        { path: "challengeId", select: "title domain status" },
        { path: "review.reviewedBy", select: "name email role" },
      ]);

      const submitterId = proposal.submittedBy._id || proposal.submittedBy;
      const formattedStatus = status.toLowerCase().replace("_", " ");

      createNotification({
        userId: submitterId,
        type: `proposal_${status.toLowerCase()}`,
        message: `Your proposal for "${proposal.challengeId.title}" was ${formattedStatus}.${remarks ? ` Remarks: ${remarks}` : ""}`,
        proposalId: proposal._id,
        challengeId: proposal.challengeId._id,
      }).catch(console.error);

      return res.status(200).json({
        success: true,
        message: `Proposal ${formattedStatus} successfully`,
        proposal,
      });
    }

    // -----------------------------------------
    // HANDLE APPROVED STATUS (AUTOMATIC PROJECT KICKOFF)
    // -----------------------------------------
    if (!facultyMentor) {
      return res.status(400).json({
        success: false,
        message:
          "facultyMentor ID is required when approving a proposal to start the project",
      });
    }

    const existingProject = await Project.findOne({ proposalId: proposal._id });
    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "A project already exists for this proposal",
      });
    }

    const challenge = await Challenge.findById(proposal.challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Associated Challenge not found",
      });
    }

    // Update Proposal State
    proposal.status = "APPROVED";
    proposal.review = {
      reviewedBy: req.user.id || req.user._id,
      reviewedAt: new Date(),
      remarks: remarks || null,
    };
    await proposal.save();

    // Create Project & Update Challenge
    let project;
    try {
      project = await Project.create({
        challengeId: proposal.challengeId,
        proposalId: proposal._id,
        heiId: proposal.heiId,
        teamId: proposal.teamId,
        facultyMentor,
        title: proposal.title,
        description: proposal.proposedSolution,
        status: "PLANNED",
        startDate: startDate || null,
        endDate: endDate || null,
      });

      // Update Challenge status to IN_PROJECT
      challenge.status = "IN_PROJECT";
      await challenge.save();
    } catch (autoCreateError) {
      // Rollback proposal if project creation fails
      proposal.status = previousStatus;
      proposal.review = undefined;
      await proposal.save();

      console.error("Project creation failed, rolled back proposal:", autoCreateError);
      return res.status(500).json({
        success: false,
        message: "Failed to create project automatically. Proposal review reverted.",
        error: autoCreateError.message,
      });
    }

    // Populate Response Data
    const populatedProject = await Project.findById(project._id)
      .populate({ path: "challengeId", select: "title domain status" })
      .populate({ path: "proposalId", select: "title status" })
      .populate({ path: "heiId", select: "name type location" })
      .populate({ path: "teamId", select: "name description" })
      .populate({ path: "facultyMentor", select: "name email role" });

    const submitterId = proposal.submittedBy._id || proposal.submittedBy;

    // Notifications
    createNotification({
      userId: submitterId,
      type: "proposal_approved",
      message: `Your proposal "${proposal.title}" has been approved!`,
      proposalId: proposal._id,
      challengeId: proposal.challengeId,
    }).catch(console.error);

    createNotification({
      userId: facultyMentor,
      type: "project_created",
      message: `You have been assigned as Faculty Mentor for project "${project.title}".`,
      projectId: project._id,
      challengeId: proposal.challengeId,
    }).catch(console.error);

    return res.status(200).json({
      success: true,
      message: "Proposal approved and project automatically started",
      proposal,
      project: populatedProject,
    });
  } catch (error) {
    console.error("Review proposal error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to review proposal",
      error: error.message,
    });
  }
};

module.exports = {
  createProposal,
  submitProposal,
  reviewProposal,
};