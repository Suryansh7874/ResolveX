
const Milestone = require("../models/Milestone");
const Project = require("../models/Project");
const createNotification = require("../utils/createNotification");


// ==========================================
// CREATE MILESTONE
// Government creates milestones for a project
// ==========================================

const createMilestone = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      dueDate,
      deliverables = [],
    } = req.body;

    if (!projectId || !title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message:
          "projectId, title, description and dueDate are required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const milestone = await Milestone.create({
      projectId,
      title,
      description,
      dueDate,
      deliverables,
      status: "PENDING",
    });

    // Notify faculty mentor
    if (project.facultyMentor) {
      await createNotification({
        userId: project.facultyMentor,
        type: "milestone_created",
        message: `A new milestone "${title}" has been created for project "${project.title}".`,
        projectId: project._id,
      });
    }

    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate({
        path: "projectId",
        select: "title status heiId teamId",
      })
      .populate({
        path: "reviewedBy",
        select: "name email role",
      });

    return res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      milestone: populatedMilestone,
    });
  } catch (error) {
    console.error("Create milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create milestone",
      error: error.message,
    });
  }
};


// ==========================================
// GET PROJECT MILESTONES
// ==========================================

const getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const milestones = await Milestone.find({
      projectId,
    }).sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: milestones.length,
      milestones,
    });
  } catch (error) {
    console.error("Get milestones error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch milestones",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE MILESTONE
// ==========================================

const getMilestoneById = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId)
      .populate({
        path: "projectId",
        select: "title status heiId teamId facultyMentor",
      })
      .populate({
        path: "reviewedBy",
        select: "name email role",
      });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    return res.status(200).json({
      success: true,
      milestone,
    });
  } catch (error) {
    console.error("Get milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch milestone",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE MILESTONE
// Government can edit milestone details
// ==========================================

const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const {
      title,
      description,
      dueDate,
      deliverables,
    } = req.body;

    const milestone = await Milestone.findById(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    if (title !== undefined) milestone.title = title;
    if (description !== undefined) milestone.description = description;
    if (dueDate !== undefined) milestone.dueDate = dueDate;
    if (deliverables !== undefined) {
      milestone.deliverables = deliverables;
    }

    await milestone.save();

    return res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      milestone,
    });
  } catch (error) {
    console.error("Update milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update milestone",
      error: error.message,
    });
  }
};


// ==========================================
// START MILESTONE
// Faculty / team starts working
// ==========================================

const startMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId)
      .populate("projectId");

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    if (milestone.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending milestones can be started",
      });
    }

    milestone.status = "IN_PROGRESS";

    await milestone.save();

    return res.status(200).json({
      success: true,
      message: "Milestone started successfully",
      milestone,
    });
  } catch (error) {
    console.error("Start milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start milestone",
      error: error.message,
    });
  }
};


// ==========================================
// SUBMIT MILESTONE
// ==========================================

const submitMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId)
      .populate("projectId");

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    if (
      milestone.status !== "IN_PROGRESS" &&
      milestone.status !== "REVISION_REQUIRED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only in-progress or revision-required milestones can be submitted",
      });
    }

    milestone.status = "SUBMITTED";
    milestone.submittedAt = new Date();

    await milestone.save();

    // Notify faculty mentor
    if (milestone.projectId.facultyMentor) {
      await createNotification({
        userId: milestone.projectId.facultyMentor,
        type: "milestone_submitted",
        message: `Milestone "${milestone.title}" has been submitted for review.`,
        projectId: milestone.projectId._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Milestone submitted successfully",
      milestone,
    });
  } catch (error) {
    console.error("Submit milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit milestone",
      error: error.message,
    });
  }
};


// ==========================================
// REVIEW MILESTONE
// Faculty mentor reviews milestone
// ==========================================

const reviewMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status, reviewRemarks } = req.body;

    const allowedStatuses = [
      "APPROVED",
      "REVISION_REQUIRED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use APPROVED or REVISION_REQUIRED",
      });
    }

    const milestone = await Milestone.findById(milestoneId)
      .populate("projectId");

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    if (milestone.status !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "Only submitted milestones can be reviewed",
      });
    }

    milestone.status = status;
    milestone.reviewedBy = req.user.id;
    milestone.reviewedAt = new Date();
    milestone.reviewRemarks = reviewRemarks || null;

    await milestone.save();

    // Notify faculty/team owner
    if (milestone.projectId.facultyMentor) {
      await createNotification({
        userId: milestone.projectId.facultyMentor,
        type:
          status === "APPROVED"
            ? "milestone_approved"
            : "milestone_revision_required",
        message:
          status === "APPROVED"
            ? `Milestone "${milestone.title}" has been approved.`
            : `Revision is required for milestone "${milestone.title}".`,
        projectId: milestone.projectId._id,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "APPROVED"
          ? "Milestone approved successfully"
          : "Milestone marked for revision",
      milestone,
    });
  } catch (error) {
    console.error("Review milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to review milestone",
      error: error.message,
    });
  }
};


// ==========================================
// COMPLETE MILESTONE
// ==========================================

const completeMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId)
      .populate("projectId");

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    if (milestone.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message:
          "Only approved milestones can be completed",
      });
    }

    milestone.status = "COMPLETED";

    await milestone.save();

    return res.status(200).json({
      success: true,
      message: "Milestone completed successfully",
      milestone,
    });
  } catch (error) {
    console.error("Complete milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete milestone",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE MILESTONE
// ==========================================

const deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    await Milestone.findByIdAndDelete(milestoneId);

    return res.status(200).json({
      success: true,
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    console.error("Delete milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete milestone",
      error: error.message,
    });
  }
};


module.exports = {
  createMilestone,
  getProjectMilestones,
  getMilestoneById,
  updateMilestone,
  startMilestone,
  submitMilestone,
  reviewMilestone,
  completeMilestone,
  deleteMilestone,
};