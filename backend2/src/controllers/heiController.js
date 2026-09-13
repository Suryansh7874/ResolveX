const HEI = require("../models/HEI");

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


module.exports = {
  createHEI,
  getHEIs,
};