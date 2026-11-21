const HEI = require("../models/HEI");


const calculateHEIMatchScore = (challenge, hei) => {
  
  const requiredExpertise =
    challenge.aiAnalysis?.requiredExpertise || []; // Get the required expertise from the challenge's AI analysis, or an empty array if not available

  const requiredTechnologies =
    challenge.aiAnalysis?.technologies || [];  // Get the required technologies from the challenge's AI analysis, or an empty array if not available

  const challengeDomain =
    challenge.domain?.toLowerCase();// Get the challenge's domain in lowercase, or undefined if not available

  const heiDisciplines =
    (hei.disciplines || []).map(item => item.toLowerCase()); // Get the HEI's disciplines in lowercase, or an empty array if not available

  const heiResearchAreas =
    (hei.researchAreas || []).map(item => item.toLowerCase()); // Get the HEI's research areas in lowercase, or an empty array if not available

  const heiExpertise =
    (hei.expertise || []).map(item => item.toLowerCase()); // Get the HEI's expertise in lowercase, or an empty array if not available

  const heiFacilities =
    (hei.innovationFacilities || []).map(item => item.toLowerCase()); // Get the HEI's innovation facilities in lowercase, or an empty array if not available

  let score = 0;

  // 1. Expertise match
  const expertiseMatches = requiredExpertise.filter(item => // Check if the required expertise matches any of the HEI's expertise, research areas, or disciplines
    heiExpertise.includes(item.toLowerCase()) ||
    heiResearchAreas.includes(item.toLowerCase()) ||
    heiDisciplines.includes(item.toLowerCase())
  );

  score += expertiseMatches.length * 20;// Each expertise match contributes 20 points to the score

  // 2. Technology/facility match
  const technologyMatches = requiredTechnologies.filter(item => // Check if the required technologies match any of the HEI's innovation facilities, expertise, or research areas
    heiFacilities.includes(item.toLowerCase()) ||
    heiExpertise.includes(item.toLowerCase()) ||
    heiResearchAreas.includes(item.toLowerCase())
  );

  score += technologyMatches.length * 10;// Each technology/facility match contributes 10 points to the score

  // 3. Domain-related research match
  const domainWords = challengeDomain
    ? challengeDomain.split("_")
    : [];

  const domainMatch = domainWords.some(word =>  // Check if any of the words in the challenge's domain match any of the HEI's research areas
    heiResearchAreas.some(area => area.includes(word))
  );

  if (domainMatch) {
    score += 20;// If there's a domain-related research match, add 20 points to the score
  }

  // Maximum score = 100
  score = Math.min(score, 100);

  return {
    score,
    expertiseMatches,
    technologyMatches,
  };
};


const findMatchingHEIs = async (challenge) => {
  const heis = await HEI.find({
    isActive: true,
  });

  const matches = heis.map(hei => {
    const result = calculateHEIMatchScore(challenge, hei);  // Calculate the match score for each HEI based on the challenge's requirements

    return {
      hei,
      score: result.score,
      expertiseMatches: result.expertiseMatches,
      technologyMatches: result.technologyMatches,
    };
  });

  return matches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);
};


module.exports = {
  calculateHEIMatchScore,
  findMatchingHEIs,
};