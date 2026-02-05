const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const testModels = async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const m of models) {
        console.log(`Testing model: ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            console.log(`SUCCESS with ${m}: ${response.text()}`);
            process.exit(0);
        } catch (err) {
            console.error(`FAILED with ${m}: ${err.message}`);
        }
    }
    console.log("All models failed.");
    process.exit(1);
};

testModels();
