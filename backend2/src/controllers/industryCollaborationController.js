const IndustryCollaboration = require("../models/IndustryCollaboration");
const Project = require("../models/Project");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// ==========================================
// CREATE INDUSTRY COLLABORATION
// ==========================================
// INDUSTRY can request collaboration
// HEI_ADMIN / GOVERNMENT can also initiate
// collaboration if required.
// ==========================================

const createCollaboration = async (req, res) => {
  try {
    const {
      projectId,
      industryId,
      type,
      description = "",
      proposedSupport = "",
      startDate,
      endDate,
    } = req.body;

    if (!projectId || !industryId || !type) {
      return res.status(400).json({
        success: false,
        message: "projectId, industryId and type are required",
      });
    }

    // ------------------------------------------
    // 1. Verify project
    // ------------------------------------------

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ------------------------------------------
    // 2. Verify industry user
    // ------------------------------------------

    const industry = await User.findById(industryId);

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: "Industry user not found",
      });
    }

    if (industry.role !== "INDUSTRY") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an INDUSTRY account",
      });
    }

    // ------------------------------------------
    // 3. Prevent duplicate active request
    // ------------------------------------------

    const existingCollaboration =
      await IndustryCollaboration.findOne({
        projectId,
        industryId,
        type,
        status: {
          $in: ["REQUESTED", "ACCEPTED", "ACTIVE"],
        },
      });

    if (existingCollaboration) {
      return res.status(409).json({
        success: false,
        message:
          "An active collaboration of this type already exists for this project",
      });
    }

    // ------------------------------------------
    // 4. Determine initiator
    // ------------------------------------------

    const collaboration = await IndustryCollaboration.create({
      projectId,
      industryId,
      initiatedBy: req.user.id || req.user._id,
      type,
      description,
      proposedSupport,
      status: "REQUESTED",
      startDate: startDate || null,
      endDate: endDate || null,
    });

    // ------------------------------------------
    // 5. Notify industry
    // ------------------------------------------

    if (
      String(industry._id) !==
      String(req.user.id || req.user._id)
    ) {
      await createNotification({
        userId: industry._id,
        type: "industry_collaboration_requested",
        message: `A collaboration request has been created for project "${project.title}".`,
        projectId: project._id,
      }).catch(console.error);
    }

    // ------------------------------------------
    // 6. Populate response
    // ------------------------------------------

    const populatedCollaboration =
      await IndustryCollaboration.findById(collaboration._id)
        .populate({
          path: "projectId",
          select: "title description status heiId",
        })
        .populate({
          path: "industryId",
          select: "name email role",
        })
        .populate({
          path: "initiatedBy",
          select: "name email role",
        });

    return res.status(201).json({
      success: true,
      message: "Industry collaboration created successfully",
      collaboration: populatedCollaboration,
    });
  } catch (error) {
    console.error("Create collaboration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create industry collaboration",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL COLLABORATIONS FOR A PROJECT
// ==========================================

const getProjectCollaborations = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const collaborations =
      await IndustryCollaboration.find({ projectId })
        .populate({
          path: "industryId",
          select: "name email role",
        })
        .populate({
          path: "initiatedBy",
          select: "name email role",
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: collaborations.length,
      collaborations,
    });
  } catch (error) {
    console.error("Get project collaborations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project collaborations",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE COLLABORATION
// ==========================================

const getCollaboration = async (req, res) => {
  try {
    const { id } = req.params;

    const collaboration =
      await IndustryCollaboration.findById(id)
        .populate({
          path: "projectId",
          select: "title description status heiId",
        })
        .populate({
          path: "industryId",
          select: "name email role",
        })
        .populate({
          path: "initiatedBy",
          select: "name email role",
        });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "Collaboration not found",
      });
    }

    return res.status(200).json({
      success: true,
      collaboration,
    });
  } catch (error) {
    console.error("Get collaboration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch collaboration",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE COLLABORATION STATUS
// ==========================================

const updateCollaborationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, outcome = "" } = req.body;

    const allowedStatuses = [
      "REQUESTED",
      "ACCEPTED",
      "REJECTED",
      "ACTIVE",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid collaboration status",
      });
    }

    const collaboration =
      await IndustryCollaboration.findById(id)
        .populate("projectId", "title");

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "Collaboration not found",
      });
    }

    // ------------------------------------------
    // Status transition validation
    // ------------------------------------------

    const currentStatus = collaboration.status;

    const validTransitions = {
      REQUESTED: ["ACCEPTED", "REJECTED", "CANCELLED"],
      ACCEPTED: ["ACTIVE", "CANCELLED"],
      ACTIVE: ["COMPLETED", "CANCELLED"],
      REJECTED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (
      currentStatus !== status &&
      !validTransitions[currentStatus]?.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change collaboration status from ${currentStatus} to ${status}`,
      });
    }

    collaboration.status = status;

    if (outcome !== undefined) {
      collaboration.outcome = outcome;
    }

    await collaboration.save();

    // ------------------------------------------
    // Notify industry
    // ------------------------------------------

    if (collaboration.industryId) {
      await createNotification({
        userId: collaboration.industryId,
        type: "industry_collaboration_status_updated",
        message: `Collaboration for project "${collaboration.projectId.title}" is now ${status}.`,
        projectId: collaboration.projectId._id,
      }).catch(console.error);
    }

    const updatedCollaboration =
      await IndustryCollaboration.findById(id)
        .populate({
          path: "projectId",
          select: "title description status",
        })
        .populate({
          path: "industryId",
          select: "name email role",
        })
        .populate({
          path: "initiatedBy",
          select: "name email role",
        });

    return res.status(200).json({
      success: true,
      message: "Collaboration status updated successfully",
      collaboration: updatedCollaboration,
    });
  } catch (error) {
    console.error("Update collaboration status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update collaboration status",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE COLLABORATION DETAILS
// ==========================================

const updateCollaboration = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      description,
      proposedSupport,
      startDate,
      endDate,
      outcome,
    } = req.body;

    const collaboration =
      await IndustryCollaboration.findById(id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "Collaboration not found",
      });
    }

    if (type !== undefined) {
      collaboration.type = type;
    }

    if (description !== undefined) {
      collaboration.description = description;
    }

    if (proposedSupport !== undefined) {
      collaboration.proposedSupport = proposedSupport;
    }

    if (startDate !== undefined) {
      collaboration.startDate = startDate;
    }

    if (endDate !== undefined) {
      collaboration.endDate = endDate;
    }

    if (outcome !== undefined) {
      collaboration.outcome = outcome;
    }

    await collaboration.save();

    return res.status(200).json({
      success: true,
      message: "Collaboration updated successfully",
      collaboration,
    });
  } catch (error) {
    console.error("Update collaboration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update collaboration",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE COLLABORATION
// ==========================================

const deleteCollaboration = async (req, res) => {
  try {
    const { id } = req.params;

    const collaboration =
      await IndustryCollaboration.findById(id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "Collaboration not found",
      });
    }

    if (
      !["REQUESTED", "REJECTED", "CANCELLED"].includes(
        collaboration.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only requested, rejected or cancelled collaborations can be deleted",
      });
    }

    await IndustryCollaboration.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Collaboration deleted successfully",
    });
  } catch (error) {
    console.error("Delete collaboration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete collaboration",
      error: error.message,
    });
  }
};


module.exports = {
  createCollaboration,
  getProjectCollaborations,
  getCollaboration,
  updateCollaborationStatus,
  updateCollaboration,
  deleteCollaboration,
};