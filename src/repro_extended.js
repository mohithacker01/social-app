
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
    output += await testModel("gemini-1.5-flash-001");
    output += "-----------------------------------\n";
    output += await testModel("gemini-1.5-flash-latest");
    output += "-----------------------------------\n";
    output += await testModel("gemini-pro");
    output += "-----------------------------------\n";
    output += await testModel("gemini-1.0-pro");

    fs.writeFileSync("repro_result_2.txt", output);
    console.log("Done. Check repro_result_2.txt");
})();
