require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAI() {
    console.log("Testing AI Service...");
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key present:", apiKey ? "Yes" : "No");

    if (!apiKey) {
        console.error("API Key missing!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Model initialized. Generating content...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();
        console.log("AI Response:", text);
    } catch (error) {
        console.error("AI Service Error:", error);
    }
}

testAI();
