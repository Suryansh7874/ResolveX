const HEI = require("../models/HEI");

const calculateHEIMatchScore = (challenge, hei) => {
  const requiredExpertise =
    challenge.aiAnalysis?.requiredExpertise || [];

  const requiredTechnologies =
    challenge.aiAnalysis?.technologies || [];

  const challengeDomain =
    challenge.domain?.toLowerCase();

  const heiDisciplines =
    (hei.disciplines || []).map(item => item.toLowerCase());

  const heiResearchAreas =
    (hei.researchAreas || []).map(item => item.toLowerCase());

  const heiExpertise =
    (hei.expertise || []).map(item => item.toLowerCase());

  const heiFacilities =
    (hei.innovationFacilities || []).map(item => item.toLowerCase());

  let score = 0;

  // 1. Expertise match
  const expertiseMatches = requiredExpertise.filter(item =>
    heiExpertise.includes(item.toLowerCase()) ||
    heiResearchAreas.includes(item.toLowerCase()) ||
    heiDisciplines.includes(item.toLowerCase())
  );

  score += expertiseMatches.length * 20;

  // 2. Technology/facility match
  const technologyMatches = requiredTechnologies.filter(item =>
    heiFacilities.includes(item.toLowerCase()) ||
    heiExpertise.includes(item.toLowerCase()) ||
    heiResearchAreas.includes(item.toLowerCase())
  );

  score += technologyMatches.length * 10;

  // 3. Domain-related research match
  const domainWords = challengeDomain
    ? challengeDomain.split("_")
    : [];

  const domainMatch = domainWords.some(word =>
    heiResearchAreas.some(area => area.includes(word))
  );

  if (domainMatch) {
    score += 20;
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
    const result = calculateHEIMatchScore(challenge, hei);

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