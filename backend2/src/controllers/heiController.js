const HEI = require("../models/HEI");

const Challenge = require("../models/Challenge");
const createNotification = require("../utils/createNotification");

// CREATE HEI
const createHEI = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      location,
      website,
      disciplines,
      researchAreas,
      expertise,
      innovationFacilities,
      canMentor,
      canPrototype,
      canPilot,
      canDeploy,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "HEI name is required",
      });
    }

    const hei = await HEI.create({
      name,
      type,
      description,
      location,
      website,
      disciplines,
      researchAreas,
      expertise,
      innovationFacilities,
      canMentor,
      canPrototype,
      canPilot,
      canDeploy,
    });

    return res.status(201).json({
      success: true,
      message: "HEI created successfully",
      hei,
    });
  } catch (error) {
    console.error("Create HEI error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create HEI",
      error: error.message,
    });
  }
};


// GET ALL HEIs
const getHEIs = async (req, res) => {
  try {
    const { state, district, type } = req.query;

    const filter = {
      isActive: true,
    };

    if (state) {
      filter["location.state"] = state;
    }

    if (district) {
      filter["location.district"] = district;
    }

    if (type) {
      filter.type = type;
    }

    const heis = await HEI.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: heis.length,
      heis,
    });
  } catch (error) {
    console.error("Get HEIs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch HEIs",
      error: error.message,
    });
  }
};


// ==========================================
// GET ASSIGNED CHALLENGES FOR HEI
// ==========================================
const getAssignedChallenges = async (req, res) => {
  try {
    const heiId = req.user.heiId;

    if (!heiId) {
      return res.status(400).json({
        success: false,
        message: "HEI association not found",
      });
    }

    const challenges = await Challenge.find({
      assignedHEI: heiId,
      status: "MATCHED",
    })
      .populate("submittedBy", "name email phone")
      .populate("assignedHEI", "name type location")
      .populate("assignedBy", "name email")
      .sort({ assignedAt: -1 });

    return res.status(200).json({
      success: true,
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    console.error("Get assigned challenges error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assigned challenges",
      error: error.message,
    });
  }
};


// ==========================================
// ACCEPT ASSIGNED CHALLENGE FOR HEI_ADMIN
// ==========================================
const acceptAssignedChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { remarks } = req.body;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Make sure this challenge was assigned to the logged-in HEI
    if (
      !challenge.assignedHEI ||
      challenge.assignedHEI.toString() !== req.user.heiId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This challenge is not assigned to your HEI",
      });
    }

    // Only matched challenges can be accepted
    if (challenge.status !== "MATCHED") {
      return res.status(400).json({
        success: false,
        message: "Only assigned challenges can be accepted",
      });
    }

    // Prevent duplicate response
    if (challenge.heiAcceptance?.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This challenge has already been responded to",
      });
    }

    challenge.heiAcceptance.status = "ACCEPTED";
    challenge.heiAcceptance.respondedBy = req.user.id;
    challenge.heiAcceptance.respondedAt = new Date();
    challenge.heiAcceptance.remarks = remarks || null;

    // Challenge now enters project stage
    challenge.status = "IN_PROJECT";

    await challenge.save();

    //  Trigger Notification for the user who submitted the challenge
    await createNotification({
      userId: challenge.submittedBy,
      type: "challenge_accepted",
      message: `An HEI has accepted your challenge "${challenge.title}" and moved it to the project stage!`,
      challengeId: challenge._id,
    });

    //  Trigger Notification for the Government/Admin who assigned it
    if (challenge.assignedBy) {
      await createNotification({
        userId: challenge.assignedBy,
        type: "challenge_accepted",
        message: `HEI accepted the assignment for challenge "${challenge.title}".`,
        challengeId: challenge._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Challenge accepted successfully",
      challenge,
    });
  } catch (error) {
    console.error("Accept assigned challenge error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept challenge",
      error: error.message,
    });
  }
};

// ==========================================
// REJECT ASSIGNED CHALLENGE FOR HEI_ADMIN
// ==========================================
const rejectAssignedChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { remarks } = req.body;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required when rejecting a challenge",
      });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Make sure this challenge was assigned to the logged-in HEI
    if (
      !challenge.assignedHEI ||
      challenge.assignedHEI.toString() !== req.user.heiId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This challenge is not assigned to your HEI",
      });
    }

    // Only matched challenges can be rejected
    if (challenge.status !== "MATCHED") {
      return res.status(400).json({
        success: false,
        message: "Only assigned challenges can be rejected",
      });
    }

    // Prevent duplicate response
    if (challenge.heiAcceptance?.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This challenge has already been responded to",
      });
    }

    challenge.heiAcceptance.status = "REJECTED";
    challenge.heiAcceptance.respondedBy = req.user.id;
    challenge.heiAcceptance.respondedAt = new Date();
    challenge.heiAcceptance.remarks = remarks.trim();

    // Keep challenge MATCHED.
    // Government can decide whether to reassign it.
    await challenge.save();

    //  Trigger Notification for the Government/Admin who assigned it
    if (challenge.assignedBy) {
      await createNotification({
        userId: challenge.assignedBy,
        type: "challenge_rejected",
        message: `HEI rejected the assignment for challenge "${challenge.title}". Remarks: ${remarks}`,
        challengeId: challenge._id,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Challenge assignment rejected",
      challenge,
    });
  } catch (error) {
    console.error("Reject assigned challenge error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject challenge assignment",
      error: error.message,
    });
  }
};
module.exports = {
  createHEI,
  getHEIs,
  getAssignedChallenges,
  acceptAssignedChallenge,
  rejectAssignedChallenge,
};