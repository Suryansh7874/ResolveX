const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const transcribeAudio = async (audio) => {
    try {
        if (!audio) {
            throw new Error("Audio is required");
        }

        if (!audio.buffer) {
            throw new Error("Audio buffer is required");
        }

        if (!audio.mimetype) {
            throw new Error("Audio MIME type is required");
        }

        const audioFile = await ai.files.upload({
            file: new Blob([audio.buffer], {
                type: audio.mimetype,
            }),
            config: {
                mimeType: audio.mimetype,
            },
        });

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-transcribe",

            input: [
                {
                    type: "audio",
                    uri: audioFile.uri,
                    mime_type: audioFile.mimeType,
                },
            ],

            generation_config: {
                transcription_config: {
                    language_codes: [],
                    mode: {
                        type: "smart",
                    },
                },
            },
        });

        const text = interaction.output_text;

        if (!text) {
            throw new Error("Transcription failed");
        }

        const translationResponse = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Translate the following text into English.
        Return only the English translation. Do not add explanations.
                        
        Text:
        ${text}`,
                        },
                    ],
                },
            ],
        });

        const englishText = translationResponse.text;

        if (!englishText) {
            throw new Error("English translation failed");
        }

        // const transcribedText =  englishText;

        // genAi for generating title and description

        const titleDescription = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Convert this civic complaint into a short title and a clear description.
                        
        Civic complaint:
        ${englishText}`,
                        },
                    ],
                },
            ],
        
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                        },
                        description: {
                            type: "string",
                        },
                    },
                    required: ["title", "description"],
                },
            },
        });
        
        const result = JSON.parse(titleDescription.text);
        
        if (!result.title || !result.description) {
            throw new Error("Failed to generate title and description");
        }
        
        return result;
        











 

    } catch (error) {
        throw error;
    }
};

module.exports = {
    transcribeAudio,
};