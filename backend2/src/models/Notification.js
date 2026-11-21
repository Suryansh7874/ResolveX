const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      default: null,
    },

    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "challenge_created",
        "challenge_updated",
        "challenge_assigned",
        "challenge_accepted",
        "challenge_rejected",
        "challenge_resolved",
        "challenge_requires_validation",
        "challenge_reassigned",

        "proposal_created",
        "proposal_submitted",
        "proposal_approved",
        "proposal_rejected",
        "proposal_revision_required",

        "project_created",
        "project_updated",
        "project_completed",

        "milestone_created",
        "milestone_submitted",
        "milestone_approved",
        "milestone_revision_required",
        "milestone_completed",

        "document_uploaded",
        "document_updated",

        "industry_collaboration_requested",
        "industry_collaboration_accepted",
        "industry_collaboration_rejected",
      ],
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);