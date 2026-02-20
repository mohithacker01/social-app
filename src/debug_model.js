
require("dotenv").config({ path: "./.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    console.log("Listing models...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // This method might not be directly exposed like this in all versions, checking docs via trial
        // Actually the error message in previous step was truncated. Let's try a basic generation again but print full error.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash");
    } catch (error) {
        console.error("Full Error:", error);
    }
}

listModels();
