const Challenge = require("../models/Challenge");
const { classifyChallengeWithAI } = require("./aiControllers");
const User = require("../models/User");
const {
  findMatchingHEIs,
} = require("../services/heiMatchingService");
const HEI = require("../models/HEI");
const createNotification = require("../utils/createNotification");

// ==========================================
// CREATE CHALLENGE
// ==========================================

const createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      location
    } = req.body;

    // ==========================================
    // VALIDATE INPUTS
    // ==========================================

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description and location are required"
      });
    }

    let parsedLocation;

    try {
      parsedLocation = JSON.parse(location);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid location format"
      });
    }

    const { latitude, longitude } = parsedLocation;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates"
      });
    }


    // ==========================================
    // IMAGE VALIDATION
    // ==========================================

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Challenge image is required"
      });
    }


    // ==========================================
    // PREPARE MEDIA
    // ==========================================

    const media = [];

    if (req.files.image) {
      media.push({
        type: "image",
        url: `/uploads/${req.files.image[0].filename}`
      });
    }

    if (req.files.video) {
      media.push({
        type: "video",
        url: `/uploads/${req.files.video[0].filename}`
      });
    }


   // ==========================================
    // AI ANALYSIS (WITH RESILIENT FALLBACK)
    // ==========================================
    
    let classification = {};
    
    try {
      classification = await classifyChallengeWithAI(title, description);
    } catch (aiError) {
      console.error("[Fallback] AI Auto-classification failed:", aiError.message);
      
      // Provide safe defaults so the citizen's submission still succeeds
      classification = {
        domain: "OTHER", // Safe default domain supported by the platform
        subDomain: "GENERAL",
        summary: description.substring(0, 150) + "...",
        priority: "MEDIUM",
        impactLevel: "MEDIUM",
        innovationPotential: "MEDIUM",
        requiredExpertise: [],
        technologies: [],
        keywords: []
      };
    }


    // ==========================================
    // AUTOMATIC DUPLICATE CHECK
    // ==========================================

    const point = {
      type: "Point",
      coordinates: [
        longitude,
        latitude
      ]
    };

    const potentialDuplicates = await Challenge.find({
      domain: classification.domain,

      location: {
        $near: {
          $geometry: point,
          $maxDistance: 50
        }
      }
    }).limit(10);


    // if (potentialDuplicates.length > 0) {
    //   return res.status(409).json({
    //     success: false,
    //     duplicate: true,
    //     message: "A potential duplicate challenge already exists nearby",
    //     potentialDuplicates
    //   });
    // }


    // ==========================================
    // CREATE CHALLENGE
    // ==========================================

    const challenge = await Challenge.create({
      submittedBy: req.user.id,

      title,

      description,

      domain: classification.domain,


      location: {
        type: "Point",
        coordinates: [
          longitude,
          latitude
        ]
      },

      media,

      priority: classification.priority,

      aiAnalysis: {
        summary: classification.summary,

        subDomain: classification.subDomain,

        requiredExpertise:
          classification.requiredExpertise,

        technologies:
          classification.technologies,

        keywords:
          classification.keywords,

        impactLevel:
          classification.impactLevel,

        innovationPotential:
          classification.innovationPotential
      }
    });
    
   // ==========================================
    // NOTIFICATIONS
    // ==========================================
    
    // Run notifications asynchronously so they don't block the API response
    (async () => {
      try {
        // 1. Notify the Submitter
        await createNotification({
          userId: req.user.id, 
          type: "challenge_created",
          message: `Your challenge "${challenge.title}" has been successfully submitted.`,
          challengeId: challenge._id,
        });

        // 2. Notify Government Admins
        // Note: Change "GOVERNMENT" to match your exact role string (e.g., "admin", "GOVT_OFFICIAL")
        const govtAdmins = await User.find({ role: "GOVERNMENT" }).select("_id");
        
        if (govtAdmins.length > 0) {
          const adminNotifications = govtAdmins.map((admin) =>
            createNotification({
              userId: admin._id,
              type: "challenge_requires_validation",
              message: `A new challenge "${challenge.title}" has been submitted and requires validation.`,
              challengeId: challenge._id,
            })
          );
          
          await Promise.all(adminNotifications);
        }
      } catch (notifError) {
        console.error("Failed to send challenge creation notifications:", notifError);
      }
    })();

    // ==========================================
    // RETURN SUCCESS
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge
    });
  } catch (error) {

    console.error("Create challenge error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET ALL CHALLENGES
// ==========================================

const getChallenges = async (req, res) => {
  try {

    const {
      domain,
      status,
      priority
    } = req.query;

    const filter = {};

    if (domain) {
      filter.domain = domain;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }


    const challenges = await Challenge.find(filter)
      .populate(
        "submittedBy",
        "name email phone role"
      )
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      count: challenges.length,
      challenges
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET MY CHALLENGES
// ==========================================

const getMyChallenges = async (req, res) => {
  try {

    const challenges = await Challenge.find({
      submittedBy: req.user.id
    })
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      count: challenges.length,
      challenges
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET CHALLENGE BY ID
// ==========================================

const getChallengeById = async (req, res) => {
  try {

    const { challengeId } = req.params;

    const challenge = await Challenge.findById(
      challengeId
    ).populate(
      "submittedBy",
      "name email phone role"
    );


    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
    }


    return res.status(200).json({
      success: true,
      challenge
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// CHECK DUPLICATE CHALLENGE
// ==========================================

const checkDuplicateChallenge = async (req, res) => {
  try {

    const {
      domain,
      location
    } = req.body;


    if (
      !domain ||
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Domain and valid location are required"
      });
    }


    const point = {
      type: "Point",
      coordinates: [
        location.longitude,
        location.latitude
      ]
    };


    const potentialDuplicates = await Challenge.find({
      domain,

      location: {
        $near: {
          $geometry: point,
          $maxDistance: 50
        }
      }
    })
      .limit(10);


    if (potentialDuplicates.length === 0) {

      return res.status(200).json({
        success: true,
        duplicate: false,
        message: "No potential duplicate challenge found"
      });
    }


    return res.status(200).json({
      success: true,
      duplicate: true,
      message: "Potential duplicate challenge found",
      potentialDuplicates
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// SUPPORT CHALLENGE
// ==========================================

const supportChallenge = async (req, res) => {
  try {

    const { challengeId } = req.params;

    const userId = req.user.id;


    const challenge = await Challenge.findById(
      challengeId
    );


    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
    }


    const alreadySupported =
      challenge.supportedBy.some(
        id => id.toString() === userId.toString()
      );


    if (alreadySupported) {

      return res.status(400).json({
        success: false,
        message: "You have already supported this challenge"
      });
    }


    challenge.supportedBy.push(userId);

    await challenge.save();


    return res.status(200).json({
      success: true,
      message: "Challenge supported successfully",
      supportCount:
        challenge.supportedBy.length,
      challenge
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// DELETE MY CHALLENGE
// ==========================================

const deleteMyChallenge = async (req, res) => {
  try {

    const { challengeId } = req.params;

    const challenge =
      await Challenge.findOneAndDelete({
        _id: challengeId,
        submittedBy: req.user.id
      });


    if (!challenge) {

      return res.status(404).json({
        success: false,
        message:
          "Challenge not found or you are not authorized"
      });
    }


    return res.status(200).json({
      success: true,
      message: "Challenge deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// FIND MATCHING HEIs
// ==========================================

const matchChallengeWithHEIs = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const matches = await findMatchingHEIs(challenge);

    return res.status(200).json({
      success: true,
      challengeId: challenge._id,
      count: matches.length,
      matches: matches.map((match) => ({
        hei: match.hei,
        score: match.score,
        expertiseMatches: match.expertiseMatches,
        technologyMatches: match.technologyMatches,
      })),
    });
  } catch (error) {
    console.error("HEI matching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to find matching HEIs",
      error: error.message,
    });
  }
};


// ==========================================
// VALIDATE / REJECT CHALLENGE
// ==========================================

const validateChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { isValidated, notes, rejectionReason } = req.body;

    if (typeof isValidated !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isValidated must be true or false",
      });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (
      ["IN_PROJECT", "RESOLVED"].includes(challenge.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Challenge can no longer be validated",
      });
    }

    if (isValidated) {
      challenge.status = "VALIDATED";

      challenge.validation = {
        isValidated: true,
        validatedBy: req.user.id,
        validatedAt: new Date(),
        validationNotes: notes || null,
        rejectionReason: null,
      };
    } else {
      challenge.status = "REJECTED";

      challenge.validation = {
        isValidated: false,
        validatedBy: req.user.id,
        validatedAt: new Date(),
        validationNotes: notes || null,
        rejectionReason: rejectionReason || "Challenge rejected",
      };
    }

    await challenge.save();

    

    return res.status(200).json({
      success: true,
      message: isValidated
        ? "Challenge validated successfully"
        : "Challenge rejected successfully",
      challenge,
    });

  } catch (error) {

    console.error("Challenge validation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate challenge",
      error: error.message,
    });
  }
};

// ==========================================
// ASSIGN CHALLENGE TO HEI
// ==========================================
const assignChallengeToHEI = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { heiId } = req.body;

    if (!heiId) {
      return res.status(400).json({
        success: false,
        message: "heiId is required",
      });
    }

    // Find challenge
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Challenge must be validated first and rejected challenges can be reassigned
    const canAssign =
        challenge.status === "VALIDATED" ||
        (
            challenge.status === "MATCHED" &&
            challenge.heiAcceptance?.status === "REJECTED"
        );

        if (!canAssign) {
        return res.status(400).json({
            success: false,
            message:
            "Only validated challenges or rejected HEI assignments can be reassigned",
        });
        }

    // Find HEI
    const hei = await HEI.findById(heiId);

    if (!hei) {
      return res.status(404).json({
        success: false,
        message: "HEI not found",
      });
    }

    // HEI must be active
    if (!hei.isActive) {
      return res.status(400).json({
        success: false,
        message: "This HEI is not active",
      });
    }

    // Assign HEI
    challenge.assignedHEI = hei._id;
    challenge.assignedBy = req.user.id;
    challenge.assignedAt = new Date();

    // HEI needs to respond
    challenge.heiAcceptance = {
      status: "PENDING",
      respondedBy: null,
      respondedAt: null,
      remarks: null,
    };

    // Challenge is now matched
    challenge.status = "MATCHED";

    await challenge.save();

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate("assignedHEI")
      .populate("assignedBy", "name email");

      //  Trigger Notification for the challenge submitter
    await createNotification({
      userId: challenge.submittedBy,
      type: "challenge_assigned",
      message: `Your challenge "${challenge.title}" has been assigned to ${hei.name}.`,
      challengeId: challenge._id,
    });

    return res.status(200).json({
      success: true,
      message: "Challenge assigned to HEI successfully",
      challenge: populatedChallenge,
    });
  } catch (error) {
    console.error("Assign challenge error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign challenge to HEI",
      error: error.message,
    });
  }
};


module.exports = {
  createChallenge,
  getChallenges,
  checkDuplicateChallenge,
  supportChallenge,
  deleteMyChallenge,
  getMyChallenges,
  getChallengeById,
  matchChallengeWithHEIs,
  validateChallenge,
  assignChallengeToHEI,
};