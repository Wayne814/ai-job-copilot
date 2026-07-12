const { Groq } = require("groq-sdk");
const OpenAI = require("openai");

const groqKey = process.env.GROQ_API_KEY?.trim();
const openAIKey = process.env.OPENAI_API_KEY?.trim();

const groq = groqKey
  ? new Groq({ apiKey: groqKey })
  : null;

const openai = openAIKey
  ? new OpenAI({ apiKey: openAIKey })
  : null;

async function askGroq(prompt) {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "mixtral-8x7b-32768",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_completion_tokens: 2048,
  });
  return completion.choices[0].message.content.trim();
}

async function askOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });
  return response.choices[0].message.content.trim();
}

async function askAI(prompt) {
  try {
    if (groq) {
      try {
        return await askGroq(prompt);
      } catch (error) {
        console.error("GROQ ERROR:", error.message || error);
      }
    }

    if (openai) {
      try {
        return await askOpenAI(prompt);
      } catch (error) {
        console.error("OPENAI ERROR:", error.message || error);
      }
    }

    return fallbackResume(prompt);
  } catch (error) {
    console.error("AI FALLBACK ERROR:", error.message || error);
    return fallbackResume(prompt);
  }
}

function fallbackResume(prompt) {
  console.warn("No valid AI provider configured, returning fallback resume output.");
  const lines = [
    "[Fallback Resume]",
    "",
    "This is a placeholder resume generated because no valid AI key was configured.",
    "Use the backend .env file with a valid GROQ_API_KEY or OPENAI_API_KEY for full functionality.",
    "",
    "Provided Resume Data:\n",
    prompt,
  ];
  return lines.join("\n");
}

module.exports = { askAI, groq, openai };

/**
 * Resume Generator
 */
async function generateResume(data) {
  const prompt = `
Create a professional ATS-optimized resume.

Candidate Name:
${data.name || "(No name provided)"}

Professional Title:
${data.jobTitle || "(No title provided)"}

Skills:
${(Array.isArray(data.skills) ? data.skills.join(", ") : data.skills) || "(No skills provided)"}

Experience:
${data.experience || "(No experience provided)"}

Education:
${data.education || "(No education provided)"}

Projects:
${data.projects || "(No projects provided)"}

Certifications:
${data.certifications || "(No certifications provided)"}

Requirements:
- Write a professional, modern resume
- Optimize for ATS (Applicant Tracking Systems)
- Use clear formatting with proper sections
- Include metrics and achievements where applicable
- Return only the formatted resume content, no explanations
`;

  return await askAI(prompt);
}

/**
 * Cover Letter Generator
 */
async function generateCoverLetter(data) {
  const prompt = `
Write a professional cover letter tailored to the position.

Company:
${data.company || "(No company provided)"}

Position:
${data.jobTitle || "(No position provided)"}

Applicant:
${data.name || "(No name provided)"}

Skills:
${(Array.isArray(data.skills) ? data.skills.join(", ") : data.skills) || "(No skills provided)"}

Experience:
${data.experience || "(No experience provided)"}

Requirements:
- Write a compelling, professional cover letter
- Highlight relevant experience and skills
- Show enthusiasm for the position and company
- Return only the cover letter content, no explanations
`;

  return await askAI(prompt);
}

/**
 * Portfolio Generator
 */
async function generatePortfolio(data) {
  const prompt = `
Create a professional software developer portfolio.

Name:
${data.name}

Bio:
${data.summary}

Skills:
${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}

Projects:
${data.projects}

Github:
${data.github}

LinkedIn:
${data.linkedin}

Return portfolio in markdown.
`;

  return await askAI(prompt);
}

/**
 * ATS Score
 */
async function calculateATS(data) {
  const prompt = `
Evaluate this resume.

Resume:
${data.resume}

Job Description:
${data.jobDescription}

Return:

ATS Score /100

Missing Keywords

Strengths

Weaknesses

Recommendations
`;

  return await askAI(prompt);
}

/**
 * Resume Tailoring
 */
async function tailorResume(data) {
  const prompt = `
Rewrite this resume specifically for this job.

Resume:

${data.resume}

Job Description:

${data.jobDescription}

Optimize for ATS.

Return only the improved resume.
`;

  return await askAI(prompt);
}

/**
 * LinkedIn Summary
 */
async function generateLinkedInSummary(data) {
  const prompt = `
Write an engaging LinkedIn About section.

Name:
${data.name}

Role:
${data.jobTitle}

Skills:
${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}

Experience:
${data.experience}
`;

  return await askAI(prompt);
}

/**
 * Interview Questions
 */
async function generateInterviewQuestions(data) {
  const prompt = `
Generate 20 interview questions.

Role:
${data.jobTitle}

Difficulty:
Medium

Return model answers too.
`;

  return await askAI(prompt);
}

module.exports = {
  generateResume,
  generateCoverLetter,
  generatePortfolio,
  calculateATS,
  tailorResume,
  generateLinkedInSummary,
  generateInterviewQuestions,
};