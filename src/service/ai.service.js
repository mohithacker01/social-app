const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are an expert in generating bhojpuri captions for images without using abusive word.
    You generate single caption for the imageConfig.
    Your caption should be short and engaging.
    You use hashtags and emojis in the caption`
});

async function generateCaption(base64ImageFile, mimeType = "image/jpeg") {
    console.log("generateCaption: Start");
    try {
        const prompt = "Generate a caption for this image in Bhojpuri language.";
        const imagePart = {
            inlineData: {
                data: base64ImageFile,
                mimeType: mimeType
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("generateCaption: Success", text);
        return text;
    } catch (error) {
        console.error("generateCaption: Error", error);
        throw error;
    }
}

module.exports = {
    generateCaption
}