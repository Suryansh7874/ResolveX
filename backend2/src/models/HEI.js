const mongoose = require("mongoose");

const heiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "UNIVERSITY",
        "COLLEGE",
        "RESEARCH_INSTITUTE",
        "INNOVATION_CENTER",
        "OTHER",
      ],
      default: "UNIVERSITY",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      city: {
        type: String,
        trim: true,
      },

      district: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
        default: "Jharkhand",
      },
    },

    website: {
      type: String,
      trim: true,
      default: null,
    },

    disciplines: {
      type: [String],
      default: [],
    },

    researchAreas: {
      type: [String],
      default: [],
    },

    expertise: {
      type: [String],
      default: [],
    },

    innovationFacilities: {
      type: [String],
      default: [],
    },

    canMentor: {
      type: Boolean,
      default: true,
    },

    canPrototype: {
      type: Boolean,
      default: false,
    },

    canPilot: {
      type: Boolean,
      default: false,
    },

    canDeploy: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("HEI", heiSchema);