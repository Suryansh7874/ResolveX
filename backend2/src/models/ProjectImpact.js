const mongoose = require("mongoose");

const projectImpactSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true
    },

    deploymentStatus: {
      type: String,
      enum: [
        "NOT_DEPLOYED",
        "PILOT",
        "PARTIALLY_DEPLOYED",
        "FULLY_DEPLOYED"
      ],
      default: "NOT_DEPLOYED"
    },

    beneficiaries: {
      type: Number,
      default: 0
    },

    locationsCovered: {
      type: Number,
      default: 0
    },

    communitiesReached: {
      type: Number,
      default: 0
    },

    measurableOutcomes: [
      {
        metric: String,
        value: String,
        unit: String
      }
    ],

    impactSummary: {
      type: String,
      default: null
    },

    challengesAfterDeployment: {
      type: String,
      default: null
    },

    evidence: [
      {
        type: String
      }
    ],

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    verifiedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectImpact", projectImpactSchema);