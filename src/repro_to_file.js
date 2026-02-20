
require("dotenv").config({ path: "./.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function testModel(modelName) {
    let log = `Testing model: ${modelName}\n`;
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: "You are a helpful assistant."
        });

        const prompt = "Reply with 'Test OK'.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        log += `Success: ${response.text()}\n`;
    } catch (error) {
        log += `Error: ${error.message}\n`;
    }
    return log;
}

(async () => {
    let output = "";
    output += await testModel("gemini-1.5-flash");
    output += "-----------------------------------\n";
    output += await testModel("gemini-2.0-flash");
    output += "-----------------------------------\n";
    output += await testModel("gemini-1.5-pro");

    fs.writeFileSync("repro_result.txt", output);
    console.log("Done. Check repro_result.txt");
})();
