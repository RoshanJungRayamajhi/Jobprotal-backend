require("dotenv").config("directory", "../.env");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getAtsScore(resumeText, job) {
  try {
    const jobDescription = `
Title: ${job.title || ""}
Description: ${job.description || ""}
Requirements: ${(job.requirements || []).join(", ")}
Skills: ${(job.skills || []).join(", ")}
        `.trim();

    const prompt = `
Compare the resume below against the job description and return ONLY a JSON object (no markdown, no preamble, no backticks) with this exact shape:

{
  "score": <integer 0-100>,
  "matchedSkills": [<strings>],
  "missingSkills": [<strings>],
  "summary": "<one short sentence>"
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText.slice(0, 8000)}
        `.trim();

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: prompt,
      system_instruction:
        "You are an ATS (Applicant Tracking System) evaluator that outputs strict JSON only.",
    });

    const raw = interaction.output_text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(raw);
    } catch (parseErr) {
      return {
        score: null,
        matchedSkills: [],
        missingSkills: [],
        summary: "Could not evaluate resume",
      };
    }
  } catch (error) {
     res.status(500).json({
      message: "Error evaluating ATS score",
      success: false,
      error: error.message,
    });
    throw error;
  }
}

module.exports = { getAtsScore };
