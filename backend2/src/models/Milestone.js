const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "IN_PROGRESS",
        "SUBMITTED",
        "APPROVED",
        "REVISION_REQUIRED",
        "COMPLETED",
      ],
      default: "PENDING",
    },

    deliverables: {
      type: [String],
      default: [],
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewRemarks: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Milestone", milestoneSchema);