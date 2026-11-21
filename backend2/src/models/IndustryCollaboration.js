const mongoose = require("mongoose");

const industryCollaborationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    industryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: [
        "MENTORING",
        "FUNDING",
        "CO_DEVELOPMENT",
        "PROTOTYPING",
        "PILOT",
        "TESTING",
        "TECH_TRANSFER"
      ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    proposedSupport: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: [
        "REQUESTED",
        "ACCEPTED",
        "REJECTED",
        "ACTIVE",
        "COMPLETED",
        "CANCELLED"
      ],
      default: "REQUESTED"
    },

    startDate: Date,
    endDate: Date,

    outcome: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "IndustryCollaboration",
  industryCollaborationSchema
);