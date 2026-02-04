const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

main();

async function generateCaption(base64ImageFile) {
    const contents = [
        {
            inlineData: {
                mimeType: "image/jpeg",
                data: base64ImageFile,
            },
        },
        { text: "Caption this image." },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
            systemInstruction: "You are an expert in generating captions for images.
            You generate single caption for the imageConfig.
            Your caption should be short and ConnectionStates.
            You use hashtags and emojis in the caption"
        }
    });

    return response.text

    console.log(response.text);
    res.json({ caption })
}

module.exports = {
    generateCaption
}