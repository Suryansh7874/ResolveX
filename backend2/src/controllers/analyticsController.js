const Challenge = require("../models/Challenge");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const ProjectTeam = require("../models/ProjectTeam");
const HEI = require("../models/HEI");
const User = require("../models/User");
const IndustryCollaboration = require("../models/IndustryCollaboration");
const ProjectImpact = require("../models/ProjectImpact");

// ==========================================
// OVERALL PLATFORM ANALYTICS
// ==========================================

const getOverviewAnalytics = async (req, res) => {
  try {
    // ==========================================
    // RUN MAJOR COUNTS IN PARALLEL
    // ==========================================

    const [
      totalChallenges,
      submittedChallenges,
      underReviewChallenges,
      validatedChallenges,
      matchedChallenges,
      inProjectChallenges,
      resolvedChallenges,
      rejectedChallenges,

      totalProposals,
      submittedProposals,
      approvedProposals,
      rejectedProposals,
      revisionRequiredProposals,

      totalProjects,
      plannedProjects,
      activeProjects,
      completedProjects,

      totalTeams,
      totalHEIs,

      totalIndustryUsers,

      totalCollaborations,
      activeCollaborations,
      completedCollaborations,

      totalImpactRecords,
      deployedProjects,
    ] = await Promise.all([
      // ------------------------------------------
      // CHALLENGES
      // ------------------------------------------

      Challenge.countDocuments(),

      Challenge.countDocuments({
        status: "SUBMITTED",
      }),

      Challenge.countDocuments({
        status: "UNDER_REVIEW",
      }),

      Challenge.countDocuments({
        status: "VALIDATED",
      }),

      Challenge.countDocuments({
        status: "MATCHED",
      }),

      Challenge.countDocuments({
        status: "IN_PROJECT",
      }),

      Challenge.countDocuments({
        status: "RESOLVED",
      }),

      Challenge.countDocuments({
        status: "REJECTED",
      }),

      // ------------------------------------------
      // PROPOSALS
      // ------------------------------------------

      Proposal.countDocuments(),

      Proposal.countDocuments({
        status: "SUBMITTED",
      }),

      Proposal.countDocuments({
        status: "APPROVED",
      }),

      Proposal.countDocuments({
        status: "REJECTED",
      }),

      Proposal.countDocuments({
        status: "REVISION_REQUIRED",
      }),

      // ------------------------------------------
      // PROJECTS
      // ------------------------------------------

      Project.countDocuments(),

      Project.countDocuments({
        status: "PLANNED",
      }),

      Project.countDocuments({
        status: "IN_PROGRESS",
      }),

      Project.countDocuments({
        status: "COMPLETED",
      }),

      // ------------------------------------------
      // TEAMS / HEIs
      // ------------------------------------------

      ProjectTeam.countDocuments(),

      HEI.countDocuments(),

      // ------------------------------------------
      // INDUSTRY
      // ------------------------------------------

      User.countDocuments({
        role: "INDUSTRY",
      }),

      IndustryCollaboration.countDocuments(),

      IndustryCollaboration.countDocuments({
        status: "ACTIVE",
      }),

      IndustryCollaboration.countDocuments({
        status: "COMPLETED",
      }),

      // ------------------------------------------
      // IMPACT
      // ------------------------------------------

      ProjectImpact.countDocuments(),

      ProjectImpact.countDocuments({
        deploymentStatus: {
          $in: [
            "PILOT",
            "PARTIALLY_DEPLOYED",
            "FULLY_DEPLOYED",
          ],
        },
      }),
    ]);

    // ==========================================
    // DOMAIN ANALYTICS
    // ==========================================

    const challengesByDomain =
      await Challenge.aggregate([
        {
          $group: {
            _id: "$domain",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // PRIORITY ANALYTICS
    // ==========================================

    const challengesByPriority =
      await Challenge.aggregate([
        {
          $group: {
            _id: "$priority",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // CHALLENGE STATUS ANALYTICS
    // ==========================================

    const challengesByStatus =
      await Challenge.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // PROJECT STATUS ANALYTICS
    // ==========================================

    const projectsByStatus =
      await Project.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // INDUSTRY COLLABORATION TYPE
    // ==========================================

    const collaborationsByType =
      await IndustryCollaboration.aggregate([
        {
          $group: {
            _id: "$type",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // INDUSTRY COLLABORATION STATUS
    // ==========================================

    const collaborationsByStatus =
      await IndustryCollaboration.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // DEPLOYMENT STATUS
    // ==========================================

    const deploymentStatus =
      await ProjectImpact.aggregate([
        {
          $group: {
            _id: "$deploymentStatus",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // IMPACT TOTALS
    // ==========================================

    const impactTotals =
      await ProjectImpact.aggregate([
        {
          $group: {
            _id: null,

            totalBeneficiaries: {
              $sum: "$beneficiaries",
            },

            totalCommunitiesReached: {
              $sum: "$communitiesReached",
            },
          },
        },
      ]);

    const totalBeneficiaries =
      impactTotals.length > 0
        ? impactTotals[0].totalBeneficiaries
        : 0;

    const totalCommunitiesReached =
      impactTotals.length > 0
        ? impactTotals[0].totalCommunitiesReached
        : 0;

    // ==========================================
    // HEI PARTICIPATION
    // ==========================================

    const heiParticipation =
      await Project.aggregate([
        {
          $group: {
            _id: "$heiId",
            projectCount: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            projectCount: -1,
          },
        },
        {
          $limit: 20,
        },
        {
          $lookup: {
            from: "heis",
            localField: "_id",
            foreignField: "_id",
            as: "hei",
          },
        },
        {
          $unwind: {
            path: "$hei",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            projectCount: 1,
            heiName: "$hei.name",
          },
        },
      ]);

    // ==========================================
    // DISTRICT-WISE CHALLENGES
    // ==========================================

    const challengesByDistrict =
      await Challenge.aggregate([
        {
          $group: {
            _id: {
              $ifNull: [
                "$location.district",
                "UNKNOWN",
              ],
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Platform analytics fetched successfully",

      data: {
        // ----------------------------------------
        // SUMMARY
        // ----------------------------------------

        summary: {
          totalChallenges,
          totalProposals,
          totalProjects,
          totalTeams,
          totalHEIs,
          totalIndustryUsers,
          totalCollaborations,
          totalImpactRecords,
        },

        // ----------------------------------------
        // CHALLENGES
        // ----------------------------------------

        challenges: {
          total: totalChallenges,

          submitted: submittedChallenges,

          underReview: underReviewChallenges,

          validated: validatedChallenges,

          matched: matchedChallenges,

          inProject: inProjectChallenges,

          resolved: resolvedChallenges,

          rejected: rejectedChallenges,

          byDomain: challengesByDomain,

          byPriority: challengesByPriority,

          byStatus: challengesByStatus,

          byDistrict: challengesByDistrict,
        },

        // ----------------------------------------
        // PROPOSALS
        // ----------------------------------------

        proposals: {
          total: totalProposals,

          submitted: submittedProposals,

          approved: approvedProposals,

          rejected: rejectedProposals,

          revisionRequired:
            revisionRequiredProposals,
        },

        // ----------------------------------------
        // PROJECTS
        // ----------------------------------------

        projects: {
          total: totalProjects,

          planned: plannedProjects,

          active: activeProjects,

          completed: completedProjects,

          byStatus: projectsByStatus,
        },

        // ----------------------------------------
        // UNIVERSITY / HEI
        // ----------------------------------------

        universities: {
          totalHEIs,

          totalTeams,

          participation: heiParticipation,
        },

        // ----------------------------------------
        // INDUSTRY
        // ----------------------------------------

        industry: {
          totalIndustryUsers,

          collaborations: totalCollaborations,

          activeCollaborations,

          completedCollaborations,

          byType: collaborationsByType,

          byStatus: collaborationsByStatus,
        },

        // ----------------------------------------
        // SOCIAL IMPACT
        // ----------------------------------------

        impact: {
          totalImpactRecords,

          deployedProjects,

          totalBeneficiaries,

          totalCommunitiesReached,

          deploymentStatus,
        },
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch platform analytics",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getOverviewAnalytics,
};