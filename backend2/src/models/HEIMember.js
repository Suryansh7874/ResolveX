const mongoose = require("mongoose");

const heiMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    heiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HEI",
      required: true,
    },

    memberType: {
      type: String,
      enum: ["FACULTY", "STUDENT"],
      required: true,
    },

    department: {
      type: String,
      trim: true,
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      default: null,
    },

    expertise: {
      type: [String],
      default: [],
    },

    researchAreas: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    availableForProjects: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

heiMemberSchema.index({
  heiId: 1,
  memberType: 1,
});

module.exports = mongoose.model("HEIMember", heiMemberSchema);