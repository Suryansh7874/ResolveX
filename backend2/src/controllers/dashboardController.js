const Challenge = require("../models/Challenge");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const ProjectTeam = require("../models/ProjectTeam");
const HEI = require("../models/HEI");

// ==========================================
// 1. GOVERNMENT DASHBOARD
// ==========================================
const getGovernmentDashboard = async (req, res) => {
  try {
    const [
      totalChallenges,
      challengeStatusStats,
      totalProposals,
      proposalStatusStats,
      totalProjects,
      projectStatusStats,
      totalHEIs,
      totalTeams,
      pendingProposals,
      recentChallenges,
    ] = await Promise.all([
      Challenge.countDocuments(),
      Challenge.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Proposal.countDocuments(),
      Proposal.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Project.countDocuments(),
      Project.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      HEI.countDocuments(),
      ProjectTeam.countDocuments(),
      
      // Proposals needing Govt review (top 5)
      Proposal.find({ status: { $in: ["SUBMITTED", "UNDER_REVIEW"] } })
        .populate("challengeId", "title domain")
        .populate("heiId", "name location")
        .populate("teamId", "name")
        .sort({ updatedAt: -1 })
        .limit(5),

      // Recent challenge posts (top 5)
      Challenge.find()
        .populate("submittedBy", "name email role")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Format aggregate arrays into clean key-value maps
    const challengeStatsMap = challengeStatusStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const proposalStatsMap = proposalStatusStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const projectStatsMap = projectStatusStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Government dashboard metrics fetched successfully",
      data: {
        summary: {
          totalChallenges,
          totalProposals,
          totalProjects,
          totalHEIs,
          totalTeams,
        },
        challengesByStatus: {
          OPEN: challengeStatsMap.OPEN || 0,
          MATCHED: challengeStatsMap.MATCHED || 0,
          IN_PROJECT: challengeStatsMap.IN_PROJECT || 0,
          RESOLVED: challengeStatsMap.RESOLVED || 0,
          REJECTED: challengeStatsMap.REJECTED || 0,
        },
        proposalsByStatus: {
          SUBMITTED: proposalStatsMap.SUBMITTED || 0,
          UNDER_REVIEW: proposalStatsMap.UNDER_REVIEW || 0,
          APPROVED: proposalStatsMap.APPROVED || 0,
          REJECTED: proposalStatsMap.REJECTED || 0,
          REVISION_REQUIRED: proposalStatsMap.REVISION_REQUIRED || 0,
        },
        projectsByStatus: {
          PLANNED: projectStatsMap.PLANNED || 0,
          IN_PROGRESS: projectStatsMap.IN_PROGRESS || 0,
          COMPLETED: projectStatsMap.COMPLETED || 0,
          ON_HOLD: projectStatsMap.ON_HOLD || 0,
        },
        actionItems: {
          pendingProposals,
        },
        recentActivity: {
          recentChallenges,
        },
      },
    });
  } catch (error) {
    console.error("Government dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Government dashboard metrics",
      error: error.message,
    });
  }
};

// ==========================================
// 2. HEI DASHBOARD
// ==========================================
const getHeiDashboard = async (req, res) => {
  try {
    const heiId = req.user.heiId;

    if (!heiId) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any HEI",
      });
    }

    const [
      assignedChallengesCount,
      totalHeiTeams,
      heiProposalStats,
      heiProjectStats,
      recentProposals,
      activeProjects,
    ] = await Promise.all([
      Challenge.countDocuments({ assignedHEI: heiId }),
      ProjectTeam.countDocuments({ heiId }),
      Proposal.aggregate([
        { $match: { heiId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Project.aggregate([
        { $match: { heiId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      
      // HEI Proposals (top 5)
      Proposal.find({ heiId })
        .populate("challengeId", "title domain status")
        .populate("teamId", "name")
        .sort({ updatedAt: -1 })
        .limit(5),

      // HEI Active Projects (top 5)
      Project.find({ heiId, status: { $in: ["PLANNED", "IN_PROGRESS"] } })
        .populate("challengeId", "title domain")
        .populate("teamId", "name")
        .populate("facultyMentor", "name email")
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    const proposalStatsMap = heiProposalStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const projectStatsMap = heiProjectStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "HEI dashboard metrics fetched successfully",
      data: {
        summary: {
          assignedChallenges: assignedChallengesCount,
          totalTeams: totalHeiTeams,
          totalProposals: Object.values(proposalStatsMap).reduce((a, b) => a + b, 0),
          totalProjects: Object.values(projectStatsMap).reduce((a, b) => a + b, 0),
        },
        proposalsBreakdown: {
          DRAFT: proposalStatsMap.DRAFT || 0,
          SUBMITTED: proposalStatsMap.SUBMITTED || 0,
          UNDER_REVIEW: proposalStatsMap.UNDER_REVIEW || 0,
          APPROVED: proposalStatsMap.APPROVED || 0,
          REVISION_REQUIRED: proposalStatsMap.REVISION_REQUIRED || 0,
          REJECTED: proposalStatsMap.REJECTED || 0,
        },
        projectsBreakdown: {
          PLANNED: projectStatsMap.PLANNED || 0,
          IN_PROGRESS: projectStatsMap.IN_PROGRESS || 0,
          COMPLETED: projectStatsMap.COMPLETED || 0,
          ON_HOLD: projectStatsMap.ON_HOLD || 0,
        },
        recentProposals,
        activeProjects,
      },
    });
  } catch (error) {
    console.error("HEI dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch HEI dashboard metrics",
      error: error.message,
    });
  }
};

// ==========================================
// 3. CITIZEN / PUBLIC DASHBOARD
// ==========================================
const getCitizenDashboard = async (req, res) => {
  try {
    const [
      totalPublicChallenges,
      resolvedChallengesCount,
      activeProjectsCount,
      participatingHEIsCount,
      openChallenges,
      completedSolutions,
    ] = await Promise.all([
      Challenge.countDocuments(),
      Challenge.countDocuments({ status: "RESOLVED" }),
      Project.countDocuments({ status: { $in: ["PLANNED", "IN_PROGRESS"] } }),
      HEI.countDocuments(),
      
      // Open challenges accepting proposals
      Challenge.find({ status: "OPEN" })
        .select("title description domain category location createdAt")
        .sort({ createdAt: -1 })
        .limit(6),

      // Completed impact projects
      Project.find({ status: "COMPLETED" })
        .populate("challengeId", "title domain category")
        .populate("heiId", "name location")
        .select("title description startDate endDate")
        .sort({ updatedAt: -1 })
        .limit(6),
    ]);

    return res.status(200).json({
      success: true,
      message: "Citizen public metrics fetched successfully",
      data: {
        impactMetrics: {
          totalChallengesSubmitted: totalPublicChallenges,
          challengesResolved: resolvedChallengesCount,
          activeSolutionsInProgress: activeProjectsCount,
          partnerHEIs: participatingHEIsCount,
        },
        openChallenges,
        completedSolutions,
      },
    });
  } catch (error) {
    console.error("Citizen dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public dashboard metrics",
      error: error.message,
    });
  }
};

// ==========================================
// 4. FACULTY DASHBOARD
// ==========================================
const getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.id || req.user._id;

    // 1. Find teams guided by this faculty member
    const facultyTeams = await ProjectTeam.find({ facultyMembers: facultyId })
      .populate("challengeId", "title domain status")
      .populate("studentMembers", "name email");

    const teamIds = facultyTeams.map((team) => team._id);

    // 2. Parallel queries for mentored projects and proposals
    const [mentoredProjects, teamProposals] = await Promise.all([
      // Projects where this faculty is explicitly assigned as Faculty Mentor
      Project.find({ facultyMentor: facultyId })
        .populate("challengeId", "title domain status")
        .populate("teamId", "name studentMembers")
        .populate("heiId", "name location")
        .sort({ updatedAt: -1 }),

      // Proposals submitted by teams guided by this faculty
      Proposal.find({ teamId: { $in: teamIds } })
        .populate("challengeId", "title domain status")
        .populate("teamId", "name")
        .sort({ updatedAt: -1 }),
    ]);

    const activeProjects = mentoredProjects.filter((p) =>
      ["PLANNED", "IN_PROGRESS"].includes(p.status)
    );
    const completedProjects = mentoredProjects.filter(
      (p) => p.status === "COMPLETED"
    );

    return res.status(200).json({
      success: true,
      message: "Faculty dashboard metrics fetched successfully",
      data: {
        summary: {
          totalTeamsGuided: facultyTeams.length,
          totalMentoredProjects: mentoredProjects.length,
          activeProjects: activeProjects.length,
          completedProjects: completedProjects.length,
          totalProposalsSubmitted: teamProposals.length,
        },
        mentoredProjects,
        guidedTeams: facultyTeams,
        recentProposals: teamProposals.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Faculty dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Faculty dashboard metrics",
      error: error.message,
    });
  }
};

// ==========================================
// 5. STUDENT DASHBOARD
// ==========================================
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;

    // 1. Find all project teams the student is part of
    const studentTeams = await ProjectTeam.find({ studentMembers: studentId })
      .populate("challengeId", "title domain status")
      .populate("facultyMembers", "name email");

    const teamIds = studentTeams.map((team) => team._id);

    // 2. Fetch active projects and proposals for the student's teams
    const [myProjects, myProposals] = await Promise.all([
      Project.find({ teamId: { $in: teamIds } })
        .populate("challengeId", "title domain status")
        .populate("facultyMentor", "name email")
        .populate("heiId", "name")
        .sort({ updatedAt: -1 }),

      Proposal.find({ teamId: { $in: teamIds } })
        .populate("challengeId", "title domain status")
        .populate("teamId", "name")
        .sort({ updatedAt: -1 }),
    ]);

    const activeProjects = myProjects.filter((p) =>
      ["PLANNED", "IN_PROGRESS"].includes(p.status)
    );
    const completedProjects = myProjects.filter(
      (p) => p.status === "COMPLETED"
    );

    return res.status(200).json({
      success: true,
      message: "Student dashboard metrics fetched successfully",
      data: {
        summary: {
          totalTeamsParticipating: studentTeams.length,
          totalProjects: myProjects.length,
          activeProjects: activeProjects.length,
          completedProjects: completedProjects.length,
          proposalsSubmitted: myProposals.length,
        },
        myTeams: studentTeams,
        myProjects,
        myProposals,
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Student dashboard metrics",
      error: error.message,
    });
  }
};

module.exports = {
  getGovernmentDashboard,
  getHeiDashboard,
  getCitizenDashboard,
  getFacultyDashboard,
  getStudentDashboard,
};
