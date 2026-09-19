const mongoose = require("mongoose");

const projectDocumentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    documentType: {
      type: String,
      enum: [
        "PROPOSAL",
        "REPORT",
        "DESIGN",
        "RESEARCH",
        "CODE",
        "TESTING",
        "PROTOTYPE",
        "PRESENTATION",
        "OTHER",
      ],
      default: "OTHER",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProjectDocument",
  projectDocumentSchema
);