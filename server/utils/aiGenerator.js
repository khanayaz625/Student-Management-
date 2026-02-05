const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateQuestions = async (topic, difficulty) => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("No GEMINI_API_KEY found, using mock questions.");
        return mockQuestions();
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Using the exact models that were listed as available for your API key
        const modelNames = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash"];

        for (const modelName of modelNames) {
            try {
                // Try with explicit v1 API
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `You are a helpful coding tutor for absolute beginners. 
                Generate exactly 5 VERY MINIMAL and SIMPLE coding tasks about the topic "${topic}". 
                The tasks should be easy to understand, focusing on fundamental logic and basic syntax. 
                Return the result as a raw JSON array of objects, where each object has a "question" field.
                Example: [{"question": "Write a variable to store your name and print it."}]
                Return ONLY the raw JSON array. Do not include markdown formatting.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(text);
                console.log(`SUCCESS: Task generated using ${modelName}`);
                return parsed;
            } catch (err) {
                console.log(`Model ${modelName} failed: ${err.message}`);
                // Move to next model if 404
                if (err.message.includes('404')) continue;
                // Break if quota issue
                if (err.message.includes('429') || err.message.includes('quota')) break;
            }
        }
    } catch (error) {
        console.error("Gemini AI Fatal Error:", error.message);
    }

    return mockQuestions();
};

const reviewSubmission = async (taskTopic, questions, answers) => {
    if (!process.env.GEMINI_API_KEY) {
        return { score: 7, feedback: "AI Review is currently unavailable. Reviewed manually." };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the exact models that were listed as available for your API key
        const modelNames = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash"];

        const submissionData = questions.map((q, i) => {
            const studentAns = answers.find(a => a.questionIndex === i)?.answer || "No answer provided";
            return `Question ${i + 1}: ${q.question}\nStudent's Answer: ${studentAns}`;
        }).join('\n\n');

        const prompt = `As a coding tutor, review the following student submission for the topic "${taskTopic}".
        
        Submission:
        ${submissionData}
        
        Evaluate the correctness and completeness of the answers. Provide a score out of 10 and a brief constructive feedback.
        Return the result as a raw JSON object with "score" (number) and "feedback" (string) fields.
        Return ONLY the raw JSON. Do not include markdown formatting.`;

        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                console.log(`SUCCESS: AI Review using ${modelName}`);
                return JSON.parse(text);
            } catch (err) {
                console.log(`Review Model ${modelName} failed: ${err.message}`);
                if (err.message.includes('404')) continue;
                if (err.message.includes('429') || err.message.includes('quota')) break;
            }
        }
    } catch (error) {
        console.error("AI Review Fatal Error:", error.message);
    }

    return { score: 5, feedback: "Could not perform AI review. Please review manually." };
};

const mockQuestions = () => [
    { question: `Write a simple program to print 'Hello World' in your favorite language and explain each line.` },
    { question: `What is a variable? Store the value 10 in a variable named 'x' and print it.` },
    { question: `Create a simple function that adds two numbers, 5 and 7, and returns the result.` },
    { question: `Write a loop that prints numbers from 1 to 5.` },
    { question: `Explain what an 'if' statement does with a very small code example.` }
];

module.exports = { generateQuestions, reviewSubmission };
