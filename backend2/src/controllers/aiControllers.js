const { GoogleGenAI } = require("@google/genai");
// const Department = require("../models/Department");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Test AI functionality
const testAI = async (req, res) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Say hello to the Civic Issue Tracker project in one sentence.",
        });

        return res.status(200).json({
            success: true,
            message: response.text,
        });

    } catch (error) {
        console.error("Gemini API error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Function to classify issue using AI
const classifyChallengeWithAI = async (title, description) => {
    if (!title || !description) {
        throw new Error("Title or Description not found");
    }

    const allowedDomains = [
        "EDUCATION",
        "HEALTHCARE",
        "AGRICULTURE",
        "WATER_RESOURCES",
        "SANITATION",
        "ENVIRONMENT",
        "ENERGY",
        "RURAL_LIVELIHOODS",
        "URBAN_DEVELOPMENT",
        "ACCESSIBILITY",
        "PUBLIC_ADMINISTRATION",
        "DIGITAL_SERVICES",
        "TRANSPORTATION",
        "DISASTER_MANAGEMENT",
        "OTHER",
    ];

    const domainList = allowedDomains.join("\n");

    const prompt = `
You are an AI assistant for ResolveX, a Societal Innovation Collaboration Platform.

Analyze the following societal challenge.

Title:
${title}

Description:
${description}

Available domains:
${domainList}

Determine the following:

1. The primary domain of the challenge.
2. A specific sub-domain.
3. A concise summary of the challenge.
4. The priority of the challenge.
5. The level of social impact.
6. The innovation potential.
7. The expertise required to solve the challenge.
8. Technologies that may be useful.
9. Important keywords for matching the challenge with universities, researchers, students, startups and industry partners.

Rules:

- Domain MUST be selected only from the available domains.
- Do not create or modify a domain.
- Priority must be one of:
  LOW, MEDIUM, HIGH, CRITICAL

- Impact level must be one of:
  LOW, MEDIUM, HIGH, CRITICAL

- Innovation potential must be one of:
  LOW, MEDIUM, HIGH

- requiredExpertise must be an array of relevant academic or technical fields.
- technologies must be an array of relevant technologies or approaches.
- keywords must be an array of important matching terms.
- summary must be concise.
- Do not recommend a specific university or company.
- Do not assign a government department.
- Do not invent facts that are not present in the challenge.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Priority rules:

CRITICAL:
Use only for challenges involving immediate threats to life, severe public safety risks, major disasters, or situations requiring immediate intervention.

HIGH:
Use when the challenge significantly affects a community or requires urgent attention.

MEDIUM:
Use for meaningful societal problems that affect people but are not immediately urgent.

LOW:
Use for relatively minor problems with limited immediate impact.

Impact level should consider:
- number of people potentially affected
- severity of the problem
- long-term societal consequences

Innovation potential should consider:
- possibility of developing a new or improved solution
- potential for technology, research or multidisciplinary innovation
- possibility of scaling the solution

Return exactly this JSON structure:

{
    "domain": "...",
    "subDomain": "...",
    "summary": "...",
    "priority": "...",
    "impactLevel": "...",
    "innovationPotential": "...",
    "requiredExpertise": [],
    "technologies": [],
    "keywords": []
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    const aiResponse = response.text;

    let classification;

    try {
        classification = JSON.parse(aiResponse);
    } catch (error) {
        throw new Error("Gemini returned invalid JSON");
    }

    // Validate domain
    if (!allowedDomains.includes(classification.domain)) {
        throw new Error("AI returned an invalid domain");
    }

    // Validate priority
    const allowedPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ];

    if (!allowedPriorities.includes(classification.priority)) {
        throw new Error("AI returned an invalid priority");
    }

    // Validate impact
    const allowedImpactLevels = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ];

    if (!allowedImpactLevels.includes(classification.impactLevel)) {
        throw new Error("AI returned an invalid impact level");
    }

    // Validate innovation potential
    const allowedInnovationLevels = [
        "LOW",
        "MEDIUM",
        "HIGH",
    ];

    if (
        !allowedInnovationLevels.includes(
            classification.innovationPotential
        )
    ) {
        throw new Error(
            "AI returned an invalid innovation potential"
        );
    }

    // Validate arrays
    if (!Array.isArray(classification.requiredExpertise)) {
        throw new Error("AI returned invalid expertise data");
    }

    if (!Array.isArray(classification.technologies)) {
        throw new Error("AI returned invalid technology data");
    }

    if (!Array.isArray(classification.keywords)) {
        throw new Error("AI returned invalid keyword data");
    }

    return {
        domain: classification.domain,
        subDomain: classification.subDomain,
        summary: classification.summary,
        priority: classification.priority,
        impactLevel: classification.impactLevel,
        innovationPotential:
            classification.innovationPotential,
        requiredExpertise:
            classification.requiredExpertise,
        technologies:
            classification.technologies,
        keywords:
            classification.keywords,
    };
};


// classify challenge using AI
const classifyChallenge = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title or Description not found",
            });
        }

        const classification = await classifyChallengeWithAI(
            title,
            description
        );

        return res.status(200).json({
            success: true,
            classification,
        });

    } catch (error) {
        console.error("Gemini classification error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    testAI,
    classifyChallenge,
    classifyChallengeWithAI,
};