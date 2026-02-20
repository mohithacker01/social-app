require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function diagnose() {
    console.log("Diagnosing Gemini API...");

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("ERROR: GEMINI_API_KEY is not set in environment.");
        return;
    }

    console.log(`API Key status: Present (Length: ${key.length})`);

    const genAI = new GoogleGenerativeAI(key);

    const modelsToTest = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const text = result.response.text();
            console.log(`SUCCESS with ${modelName}: ${text.substring(0, 50)}...`);
            return; // Found a working model, exit
        } catch (error) {
            console.error(`FAILED with ${modelName}:`);
            console.error(error.message); // Print full error message
            if (error.status) console.error(`Status: ${error.status}`);
            if (error.statusText) console.error(`StatusText: ${error.statusText}`);
        }
    }

    console.log("All models failed.");
}

diagnose();
