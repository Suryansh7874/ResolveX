const Challenge = require("../models/Challenge");
const { classifyChallengeWithAI } = require("./aiControllers");
const {
  findMatchingHEIs,
} = require("../services/heiMatchingService");


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
        // AI ANALYSIS
        // ==========================================

        const classification = await classifyChallengeWithAI(
            title,
            description
        );


        // ==========================================
        // CREATE CHALLENGE
        // ==========================================

        const challenge = await Challenge.create({
            submittedBy: req.user.userId,

            title,

            description,

            domain: classification.domain,

            location: {
                type: "Point",
                coordinates: [longitude, latitude]
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
            submittedBy: req.user.userId
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

        const userId = req.user.userId;


        const challenge = await Challenge.findById(
            challengeId
        );


        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }


        // Check whether user already supported it

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
                submittedBy: req.user.userId
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

// FIND MATCHING HEIs
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

// VALIDATE / REJECT CHALLENGE
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

    // A challenge that is already part of a project
    // should not be validated/rejected again.
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
        validatedBy: req.user.userId,
        validatedAt: new Date(),
        validationNotes: notes || null,
        rejectionReason: null,
      };
    } else {
      challenge.status = "REJECTED";

      challenge.validation = {
        isValidated: false,
        validatedBy: req.user.userId,
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
};