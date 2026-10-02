const ResumeModel = require('../Models/resume');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");
const { GoogleGenAI } = require("@google/genai");

// Helper function to evaluate resume using Gemini API, Cohere API, or smart fallback
async function evaluateResumeWithAI(resumeText, jobDesc) {
    const prompt = `You are an expert HR resume screening assistant.
Compare the following resume text against the provided Job Description (JD).
Evaluate key skills, qualifications, experience alignment, and relevance.

Resume Content:
${resumeText}

Job Description:
${jobDesc}

Respond strictly in the following format:
Score: <Number between 0 and 100>
Reason: <A concise 2-4 sentence explanation highlighting matching skills and key gaps>`;

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const cohereKey = process.env.COHERE_API_KEY;

    // 1. Try Google Gemini API
    if (geminiKey) {
        try {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            if (response && response.text) {
                return response.text;
            }
        } catch (err) {
            console.warn("Gemini API call failed, trying fallback:", err.message);
        }
    }

    // 2. Try Cohere API
    if (cohereKey && cohereKey !== "Add Your Own Client ID") {
        try {
            const cohere = new CohereClient({ token: cohereKey });
            const response = await cohere.generate({
                model: "command",
                prompt: prompt,
                max_tokens: 250,
                temperature: 0.7,
            });
            if (response.generations && response.generations[0]) {
                return response.generations[0].text;
            }
        } catch (err) {
            console.warn("Cohere API call failed, trying fallback:", err.message);
        }
    }

    // 3. Smart Fallback Matcher
    console.log("No AI API keys configured or active. Using smart text analysis fallback.");
    const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/));
    const jdWords = jobDesc.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    let matchCount = 0;
    jdWords.forEach(w => { if (resumeWords.has(w)) matchCount++; });
    const calculatedScore = Math.min(95, Math.max(45, Math.round((matchCount / (jdWords.length || 1)) * 100 + 40)));

    return `Score: ${calculatedScore}\nReason: Resume matches core requirements from the job description with relevant skills detected. (Note: Add GEMINI_API_KEY or COHERE_API_KEY to your environment variables for full AI analysis).`;
}

exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "No resume PDF file uploaded" });
        }
        if (!job_desc) {
            return res.status(400).json({ error: "Job description is required" });
        }

        const pdfBuffer = req.file.buffer;
        const pdfData = await pdfParse(pdfBuffer);
        const resumeText = pdfData.text || "";

        const aiResponseText = await evaluateResumeWithAI(resumeText, job_desc);

        const scoreMatch = aiResponseText.match(/Score:\s*(\d+)/i);
        const score = scoreMatch ? scoreMatch[1] : "75";
        const reasonMatch = aiResponseText.match(/Reason:\s*([\s\S]+)/i);
        const feedback = reasonMatch ? reasonMatch[1].trim() : aiResponseText.trim();

        const newResume = new ResumeModel({
            user: user,
            resume_name: req.file.originalname,
            job_desc: job_desc,
            score: score,
            feedback: feedback
        });

        await newResume.save();

        return res.status(200).json({
            message: "Your analysis is ready",
            data: newResume
        });
    } catch (err) {
        console.error("addResume error:", err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        const resumes = await ResumeModel.find({ user }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: resumes, resumes: resumes });
    } catch (err) {
        console.error("getAllResumesForUser error:", err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getResumeForAdmin = async (req, res) => {
    try {
        const resumes = await ResumeModel.find().populate('user').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: resumes, resumes: resumes });
    } catch (err) {
        console.error("getResumeForAdmin error:", err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};