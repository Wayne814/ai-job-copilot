const Document = require("../models/Document");
const User = require("../models/User");

const {
  generateResume,
  generateCoverLetter,
  generatePortfolio,
  calculateATS,
  tailorResume,
  generateLinkedInSummary,
  generateInterviewQuestions,
} = require("../services/aiService");

/**
 * Helper: deduct user credits
 */
async function deductCredits(userId, amount = 1) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits < amount) {
    throw new Error("Insufficient credits");
  }

  user.credits -= amount;
  await user.save();

  return user;
}

/**
 * Helper: save document
 */
async function saveDocument(userId, type, title, content, metadata = {}) {
  return await Document.create({
    user: userId,
    type,
    title,
    content,
    metadata,
  });
}

/* ==============================
   RESUME GENERATION
============================== */
exports.createResume = async (req, res) => {
  try {
    // Validate required fields before deducting credits
    const { name, email, education, experience } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }
    
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required.",
      });
    }
    
    if (!education || !education.trim()) {
      return res.status(400).json({
        success: false,
        message: "Education is required.",
      });
    }
    
    if (!experience || !experience.trim()) {
      return res.status(400).json({
        success: false,
        message: "Experience is required.",
      });
    }

    const user = await deductCredits(req.user._id);

    const content = await generateResume(req.body);

    const document = await saveDocument(
      user._id,
      "resume",
      `Resume - ${req.body.name || "Untitled"}`,
      content,
      {
        jobTitle: req.body.jobTitle,
        skills: req.body.skills,
        education: req.body.education,
        experience: req.body.experience,
      }
    );

    res.json({
      success: true,
      credits: user.credits,
      document,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   COVER LETTER
============================== */
exports.createCoverLetter = async (req, res) => {
  try {
    const user = await deductCredits(req.user._id);

    const content = await generateCoverLetter(req.body);

    const document = await saveDocument(
      user._id,
      "cover-letter",
      `Cover Letter - ${req.body.company || "Company"}`,
      content,
      {
        company: req.body.company,
        jobTitle: req.body.jobTitle,
      }
    );

    res.json({
      success: true,
      credits: user.credits,
      document,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   PORTFOLIO
============================== */
exports.createPortfolio = async (req, res) => {
  try {
    const user = await deductCredits(req.user._id);

    const content = await generatePortfolio(req.body);

    const document = await saveDocument(
      user._id,
      "portfolio",
      `Portfolio - ${req.body.name || "Untitled"}`,
      content,
      {
        github: req.body.github,
        linkedin: req.body.linkedin,
      }
    );

    res.json({
      success: true,
      credits: user.credits,
      document,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   ATS SCORE
============================== */
exports.getATSScore = async (req, res) => {
  try {
    const result = await calculateATS(req.body);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   RESUME TAILORING
============================== */
exports.tailorResume = async (req, res) => {
  try {
    const result = await tailorResume(req.body);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   LINKEDIN SUMMARY
============================== */
exports.linkedinSummary = async (req, res) => {
  try {
    const result = await generateLinkedInSummary(req.body);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   INTERVIEW QUESTIONS
============================== */
exports.interviewQuestions = async (req, res) => {
  try {
    const result = await generateInterviewQuestions(req.body);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==============================
   GET USER DOCUMENTS
============================== */
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};