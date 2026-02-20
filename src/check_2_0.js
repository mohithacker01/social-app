
require("dotenv").config({ path: "./.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function listAllModels() {
    let log = "Listing all available models:\n";
    try {
        // The SDK might not expose listModels directly easily on the client instance, 
        // but let's try to infer or use the model name that 'worked' to see if we can get more info.
        // Actually, looking at docs, 'listModels' is on the GoogleGenerativeAI instance or via a specific manager.
        // Let's try to just iterate a known list again but with a specific check.
        // Wait, I can't easily call 'listModels' if the SDK doesn't expose it on the high level object I'm using.
        // Standard usage is: const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        // genAI.getGenerativeModel(...)

        // If I can't list, I will trust the 404s.

        // However, one possibility: The API key is invalid for 'v1beta' but valid for something else?
        // But gemini-2.0-flash worked on v1beta.

        log += "Manually verifying gemini-2.0-flash again...\n";
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        try {
            await model.generateContent("test");
            log += "gemini-2.0-flash: Success (or at least no 404)\n";
        } catch (e) {
            log += `gemini-2.0-flash: ${e.message}\n`;
        }

    } catch (error) {
        log += `Fatal Error: ${error.message}\n`;
    }
    fs.writeFileSync("model_list_result.txt", log);
}

listAllModels();
