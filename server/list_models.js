const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("--- Available Models for your Key ---");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log("No models found. Response:", JSON.stringify(data));
        }
        console.log("-------------------------------------");
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
