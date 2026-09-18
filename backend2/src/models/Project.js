const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // -----------------------------------------
    // SOURCE CHALLENGE
    // -----------------------------------------
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      unique: true,
    },

    // -----------------------------------------
    // APPROVED PROPOSAL
    // -----------------------------------------
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
      unique: true,
    },

    // -----------------------------------------
    // HEI
    // -----------------------------------------
    heiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HEI",
      required: true,
    },

    // -----------------------------------------
    // PROJECT TEAM
    // -----------------------------------------
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectTeam",
      required: true,
    },

    // -----------------------------------------
    // FACULTY MENTOR
    // -----------------------------------------
    facultyMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // -----------------------------------------
    // PROJECT DETAILS
    // -----------------------------------------
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

    // -----------------------------------------
    // PROJECT STATUS
    // -----------------------------------------
    status: {
      type: String,
      enum: [
        "PLANNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PLANNED",
    },

    // -----------------------------------------
    // PROJECT DATES
    // -----------------------------------------
    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);