const Challenge = require("../models/Challenge");
const ProjectTeam = require("../models/ProjectTeam");
const Proposal = require("../models/Proposal");
const createNotification = require("../utils/createNotification");

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

    // Challenge must be accepted and in project stage
    if (
      challenge.status !== "IN_PROJECT" ||
      challenge.heiAcceptance?.status !== "ACCEPTED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Proposal can only be created for an accepted challenge",
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

    // Team must belong to same HEI
    if (team.heiId.toString() !== heiId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This team does not belong to your HEI",
      });
    }

    // Team must belong to this challenge
    if (team.challengeId.toString() !== challengeId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team is not associated with this challenge",
      });
    }

    // -----------------------------------------
    // CHECK EXISTING PROPOSAL
    // -----------------------------------------

    const existingProposal = await Proposal.findOne({
      challengeId,
    });

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
      submittedBy: req.user.id,
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


    // Trigger Notification for proposal creator (Draft status)
    await createNotification({
      userId: req.user.id,
      type: "proposal_created",
      message: `Draft proposal "${title}" has been successfully created.`,
      proposalId: proposal._id,
      challengeId,
    });


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
        message: "Proposal not found",
      });
    }

    // Only the HEI that created the proposal can submit it
    if (proposal.heiId.toString() !== req.user.heiId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to submit this proposal",
      });
    }

    if (proposal.status !== "DRAFT" &&
        proposal.status !== "REVISION_REQUIRED") {
      return res.status(400).json({
        message: "Only draft or revision-required proposals can be submitted",
      });
    }

    proposal.status = "SUBMITTED";

    await proposal.save();

    await proposal.populate([
      {
        path: "challengeId",
        select: "title domain status",
      },
      {
        path: "teamId",
        select: "name status",
      },
      {
        path: "heiId",
        select: "name type location",
      },
      {
        path: "submittedBy",
        select: "name email role",
      },
      {
        path: "challengeId",
        select: "title domain status submittedBy",
      },
    ]);

    //  Trigger Notification for the HEI Submitter
    await createNotification({
      userId: proposal.submittedBy._id || proposal.submittedBy,
      type: "proposal_submitted",
      message: `Your proposal for challenge "${proposal.challengeId.title}" has been submitted for review.`,
      proposalId: proposal._id,
      challengeId: proposal.challengeId._id,
    });

    //  Trigger Notification for original Challenge Creator
    if (proposal.challengeId?.submittedBy) {
      await createNotification({
        userId: proposal.challengeId.submittedBy,
        type: "proposal_submitted",
        message: `A new proposal has been submitted for your challenge "${proposal.challengeId.title}".`,
        proposalId: proposal._id,
        challengeId: proposal.challengeId._id,
      });
    }
    return res.status(200).json({
      message: "Proposal submitted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Submit proposal error:", error);

    return res.status(500).json({
      message: "Failed to submit proposal",
      error: error.message,
    });
  }
};


// ==========================================
// REVIEW PROPOSAL
// ==========================================

const reviewProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, remarks } = req.body;

    const allowedStatuses = [
      "APPROVED",
      "REJECTED",
      "REVISION_REQUIRED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid review status. Use APPROVED, REJECTED, or REVISION_REQUIRED",
      });
    }

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found",
      });
    }

    if (proposal.status !== "SUBMITTED" &&
        proposal.status !== "UNDER_REVIEW") {
      return res.status(400).json({
        message: "Proposal is not available for review",
      });
    }

    proposal.status = status;

    proposal.review = {
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      remarks: remarks || null,
    };

    await proposal.save();

    await proposal.populate([
      {
        path: "challengeId",
        select: "title domain status",
      },
      {
        path: "teamId",
        select: "name status",
      },
      {
        path: "heiId",
        select: "name type location",
      },
      {
        path: "submittedBy",
        select: "name email role",
      },
      {
        path: "review.reviewedBy",
        select: "name email role",
      },
    ]);

    //  Trigger Notification for the proposal submitter with review status
    const formattedStatus = status.toLowerCase().replace("_", " ");
    
    await createNotification({
      userId: proposal.submittedBy._id || proposal.submittedBy,
      type: `proposal_${status.toLowerCase()}`,
      message: `Your proposal for "${proposal.challengeId.title}" was ${formattedStatus}.${remarks ? ` Remarks: ${remarks}` : ""}`,
      proposalId: proposal._id,
      challengeId: proposal.challengeId._id,
    });
    return res.status(200).json({
      message: `Proposal ${status.toLowerCase().replace("_", " ")} successfully`,
      proposal,
    });
  } catch (error) {
    console.error("Review proposal error:", error);

    return res.status(500).json({
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