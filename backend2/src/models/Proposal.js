const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      unique: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectTeam",
      required: true,
      unique: true,
    },

    heiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HEI",
      required: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    problemStatement: {
      type: String,
      required: true,
      trim: true,
    },

    proposedSolution: {
      type: String,
      required: true,
      trim: true,
    },

    objectives: {
      type: [String],
      default: [],
    },

    methodology: {
      type: String,
      trim: true,
      default: "",
    },

    expectedOutcomes: {
      type: [String],
      default: [],
    },

    requiredTechnologies: {
      type: [String],
      default: [],
    },

    estimatedDuration: {
      type: String,
      trim: true,
      default: null,
    },

    requiredResources: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "REVISION_REQUIRED",
      ],
      default: "DRAFT",
    },

    review: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },

      remarks: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);