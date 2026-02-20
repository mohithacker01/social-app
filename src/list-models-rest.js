require('dotenv').config();
const fs = require('fs');

async function listModelsRest() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Found models, writing to models_output.json");
            fs.writeFileSync('models_output.json', JSON.stringify(data.models, null, 2));
        } else {
            console.log("No models found or error:", JSON.stringify(data));
        }

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModelsRest();
