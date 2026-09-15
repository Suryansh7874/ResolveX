const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    // Who submitted the societal challenge
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic challenge information
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

    // Broad societal domain
    domain: {
      type: String,
      enum: [
        "EDUCATION",
        "HEALTHCARE",
        "AGRICULTURE",
        "WATER_RESOURCES",
        "SANITATION",
        "ENVIRONMENT",
        "ENERGY",
        "RURAL_LIVELIHOODS",
        "URBAN_DEVELOPMENT",
        "ACCESSIBILITY",
        "PUBLIC_ADMINISTRATION",
        "DIGITAL_SERVICES",
        "TRANSPORTATION",
        "DISASTER_MANAGEMENT",
        "OTHER",
      ],
      required: true,
      trim: true,
    },

    // Geographic location of the challenge
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    // Photos/videos related to the challenge
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },

        url: {
          type: String,
          required: true,
        },
      },
    ],

    // PDFs, reports, documents etc.
    supportingDocuments: [
      {
        name: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          trim: true,
        },
      },
    ],

    // Challenge lifecycle
    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "VALIDATED",
        "MATCHED",
        "IN_PROJECT",
        "RESOLVED",
        "REJECTED",
      ],
      default: "SUBMITTED",
    },

    // Validation details
    validation: {
        isValidated: {
            type: Boolean,
            default: false,
        },

        validatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        validatedAt: {
            type: Date,
            default: null,
        },

        validationNotes: {
            type: String,
            default: null,
            trim: true,
        },

        rejectionReason: {
            type: String,
            default: null,
            trim: true,
        },
        },

    // AI/backend determined importance
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    // Community support
    supportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // AI-generated analysis
    aiAnalysis: {
      summary: {
        type: String,
        default: null,
      },

      subDomain: {
        type: String,
        default: null,
      },

      requiredExpertise: {
        type: [String],
        default: [],
      },

      technologies: {
        type: [String],
        default: [],
      },

      keywords: {
        type: [String],
        default: [],
      },

      impactLevel: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        default: null,
      },

      innovationPotential: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: null,
      },

    },
      // Assignment details
      assignedHEI: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HEI",
        default: null
      },

      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },

      assignedAt: {
        type: Date,
        default: null
      },

      // Acceptance details from the assigned HEI
      heiAcceptance: {
        status: {
          type: String,
          enum: ["PENDING", "ACCEPTED", "REJECTED"],
          default: "PENDING"
        },

        respondedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        },

        respondedAt: {
          type: Date,
          default: null
        },

        remarks: {
          type: String,
          trim: true,
          default: null
        },
      }

      },
  
  {
    timestamps: true,
  }
);

// Geospatial index
challengeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Challenge", challengeSchema);