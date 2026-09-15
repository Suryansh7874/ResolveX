const mongoose = require("mongoose");

const projectTeamSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      unique: true,
    },

    heiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HEI",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    facultyMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HEIMember",
      },
    ],

    studentMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HEIMember",
      },
    ],

    status: {
      type: String,
      enum: ["FORMING", "ACTIVE", "COMPLETED"],
      default: "FORMING",
    },
  },
  { timestamps: true }
);

projectTeamSchema.index({ heiId: 1 });

module.exports = mongoose.model("ProjectTeam", projectTeamSchema);