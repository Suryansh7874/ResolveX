const { GoogleGenAI } = require("@google/genai");
const Department = require("../models/Department");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


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


const classifyIssueWithAI = async (title, description) => {
    if(!title || !description){
        throw new Error("Title or Description not found");
    }
     const allowedCategories = [
            "POTHOLE",
            "ROAD_DAMAGE",
            "GARBAGE",
            "WATER_LEAKAGE",
            "DRAINAGE",
            "STREETLIGHT",
            "SEWER",
            "OTHER"
        ];


        const categoryList = allowedCategories.join("\n");

        const departments = await Department.find(
            { isActive: true },
            { departmentName: 1, code: 1 }
        );


        const departmentList = departments
            .map(department => `${department.code}: ${department.departmentName}`)
            .join("\n");

    const prompt = `
        You are an AI assistant for a Civic Issue Tracker.

        Analyze the following civic issue:

        Title: ${title}

        Description: ${description}

        Available departments:
        ${departmentList}

        Available categories:
        ${categoryList}

        Determine:
        1. The category of the issue
        2. The priority of the issue
        3. The appropriate department

        Rules:
        - Select the department ONLY from the available departments listed above.
        - Return the department CODE, not the department name.
        - Do not create or invent a department.
        - Priority must be one of: LOW, MEDIUM, HIGH, CRITICAL.
        - Return ONLY valid JSON.
        - Select the category ONLY from the available categories.
        - Return the category exactly as provided.
        - Do not create or modify a category.
        - CRITICAL: Use only when there is an immediate threat to life, serious public safety risk, major infrastructure failure, or a situation requiring immediate emergency attention.
        - HIGH: Use when the issue is serious, significantly affects the public, or requires urgent attention but is not an immediate emergency.
        - MEDIUM: Use for noticeable civic problems that affect residents but do not require urgent or immediate action.
        - LOW: Use for minor issues, inconveniences, or problems with limited impact.
        - Do not assign HIGH or CRITICAL only because an issue has existed for several days.

        Return exactly this format:

        {
            "category": "...",
            "priority": "...",
            "departmentCode": "..."
        }
        `;


            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt,
            });

            const aiResponse = response.text;

            const classification = JSON.parse(aiResponse);  // json to js object 
            
            const department = await Department.findOne({
                code: classification.departmentCode,
                isActive: true,
            });


if (!department) {
    throw new Error("AI returned an invalid department code");
}

if (!allowedCategories.includes(classification.category)) {
    throw new Error("AI returned an invalid category");
}     


            const allowedPriorities = [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL",
            ];

if (!allowedPriorities.includes(classification.priority)) {
    throw new Error("AI returned an invalid priority");
}
return {
    category: classification.category,
    priority: classification.priority,
    departmentCode: classification.departmentCode,
    departmentId: department._id,
};













};



// classify issue using AI

const classifyIssue = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "title or description not found",
            });
        }

        const classification = await classifyIssueWithAI(
            title,
            description
        );

        return res.status(200).json({
            success: true,
            classification,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    testAI,
    classifyIssue,
     classifyIssueWithAI,
};