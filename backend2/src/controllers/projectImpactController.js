const ProjectImpact = require("../models/ProjectImpact");
const Project = require("../models/Project");
const createNotification = require("../utils/createNotification");

// ==========================================
// CREATE PROJECT IMPACT
// ==========================================

const createImpact = async (req, res) => {
  try {
    const {
      projectId,
      deploymentStatus = "NOT_DEPLOYED",
      beneficiaries = 0,
      locationsCovered = [],
      communitiesReached = 0,
      measurableOutcomes = [],
      impactSummary = "",
      challengesAfterDeployment = "",
      evidence = [],
    } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "projectId is required",
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
    // 2. Prevent duplicate impact record
    // ------------------------------------------

    const existingImpact =
      await ProjectImpact.findOne({ projectId });

    if (existingImpact) {
      return res.status(409).json({
        success: false,
        message:
          "Impact record already exists for this project",
      });
    }

    // ------------------------------------------
    // 3. Validate deployment status
    // ------------------------------------------

    const allowedDeploymentStatuses = [
      "NOT_DEPLOYED",
      "PILOT",
      "PARTIALLY_DEPLOYED",
      "FULLY_DEPLOYED",
    ];

    if (!allowedDeploymentStatuses.includes(deploymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deployment status",
      });
    }

    // ------------------------------------------
    // 4. Create impact
    // ------------------------------------------

    const impact = await ProjectImpact.create({
      projectId,
      deploymentStatus,
      beneficiaries,
      locationsCovered,
      communitiesReached,
      measurableOutcomes,
      impactSummary,
      challengesAfterDeployment,
      evidence,
    });

    // ------------------------------------------
    // 5. Notify faculty mentor
    // ------------------------------------------

    if (project.facultyMentor) {
      await createNotification({
        userId: project.facultyMentor,
        type: "project_impact_created",
        message: `Impact information has been added for project "${project.title}".`,
        projectId: project._id,
      }).catch(console.error);
    }

    // ------------------------------------------
    // 6. Populate
    // ------------------------------------------

    const populatedImpact =
      await ProjectImpact.findById(impact._id)
        .populate({
          path: "projectId",
          select: "title status heiId",
        });

    return res.status(201).json({
      success: true,
      message: "Project impact created successfully",
      impact: populatedImpact,
    });
  } catch (error) {
    console.error("Create impact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project impact",
      error: error.message,
    });
  }
};


// ==========================================
// GET IMPACT BY PROJECT
// ==========================================

const getImpact = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const impact =
      await ProjectImpact.findOne({ projectId })
        .populate({
          path: "projectId",
          select: "title status heiId facultyMentor",
        })
        .populate({
          path: "verifiedBy",
          select: "name email role",
        });

    if (!impact) {
      return res.status(404).json({
        success: false,
        message: "Impact record not found",
      });
    }

    return res.status(200).json({
      success: true,
      impact,
    });
  } catch (error) {
    console.error("Get impact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project impact",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE IMPACT
// ==========================================

const updateImpact = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      deploymentStatus,
      beneficiaries,
      locationsCovered,
      communitiesReached,
      measurableOutcomes,
      impactSummary,
      challengesAfterDeployment,
      evidence,
    } = req.body;

    const impact =
      await ProjectImpact.findById(id);

    if (!impact) {
      return res.status(404).json({
        success: false,
        message: "Impact record not found",
      });
    }

    // ------------------------------------------
    // Deployment status
    // ------------------------------------------

    if (deploymentStatus !== undefined) {
      const allowedStatuses = [
        "NOT_DEPLOYED",
        "PILOT",
        "PARTIALLY_DEPLOYED",
        "FULLY_DEPLOYED",
      ];

      if (!allowedStatuses.includes(deploymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment status",
        });
      }

      impact.deploymentStatus = deploymentStatus;
    }

    if (beneficiaries !== undefined) {
      impact.beneficiaries = beneficiaries;
    }

    if (locationsCovered !== undefined) {
      impact.locationsCovered = locationsCovered;
    }

    if (communitiesReached !== undefined) {
      impact.communitiesReached = communitiesReached;
    }

    if (measurableOutcomes !== undefined) {
      impact.measurableOutcomes = measurableOutcomes;
    }

    if (impactSummary !== undefined) {
      impact.impactSummary = impactSummary;
    }

    if (challengesAfterDeployment !== undefined) {
      impact.challengesAfterDeployment =
        challengesAfterDeployment;
    }

    if (evidence !== undefined) {
      impact.evidence = evidence;
    }

    await impact.save();

    return res.status(200).json({
      success: true,
      message: "Project impact updated successfully",
      impact,
    });
  } catch (error) {
    console.error("Update impact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project impact",
      error: error.message,
    });
  }
};


// ==========================================
// VERIFY IMPACT
// ==========================================
// Only GOVERNMENT should be allowed to verify
// this route through roleMiddleware.
// ==========================================

const verifyImpact = async (req, res) => {
  try {
    const { id } = req.params;

    const impact =
      await ProjectImpact.findById(id)
        .populate("projectId", "title facultyMentor");

    if (!impact) {
      return res.status(404).json({
        success: false,
        message: "Impact record not found",
      });
    }

    if (impact.verifiedAt) {
      return res.status(400).json({
        success: false,
        message: "Impact has already been verified",
      });
    }

    impact.verifiedBy =
      req.user.id || req.user._id;

    impact.verifiedAt = new Date();

    await impact.save();

    // ------------------------------------------
    // Notify faculty
    // ------------------------------------------

    if (impact.projectId.facultyMentor) {
      await createNotification({
        userId: impact.projectId.facultyMentor,
        type: "project_impact_verified",
        message: `The impact report for project "${impact.projectId.title}" has been verified.`,
        projectId: impact.projectId._id,
      }).catch(console.error);
    }

    const verifiedImpact =
      await ProjectImpact.findById(id)
        .populate({
          path: "projectId",
          select: "title status",
        })
        .populate({
          path: "verifiedBy",
          select: "name email role",
        });

    return res.status(200).json({
      success: true,
      message: "Project impact verified successfully",
      impact: verifiedImpact,
    });
  } catch (error) {
    console.error("Verify impact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify project impact",
      error: error.message,
    });
  }
};


module.exports = {
  createImpact,
  getImpact,
  updateImpact,
  verifyImpact,
};