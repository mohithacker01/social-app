
require("dotenv").config({ path: "./.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel() {
    console.log("Testing model: gemini-1.5-flash");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Reply with 'Test OK'.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testModel();
