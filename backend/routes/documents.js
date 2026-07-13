const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ==============================
// Models
// ==============================
const Document = require("../models/Document");
const User = require("../models/User");

// ==============================
// AI Service Functions
// ==============================
const {
  generateCoverLetter,
  generateResume,
  generatePortfolio,
} = require("../services/aiService");

// ==============================
// Authentication Middleware
// ==============================
const protect = require("../middleware/auth");


// ======================================================
// COVER LETTER GENERATOR
// POST /api/documents/cover-letter
// ======================================================
router.post("/cover-letter", protect, async (req, res) => {
  try {

    // Find logged in user
    const user = await User.findById(req.user._id);

    // Check credits
    if (user.credits < 1) {
      return res.status(400).json({
        message: "Insufficient credits",
      });
    }

    // Deduct one credit
    user.credits -= 1;
    await user.save();

    // Generate AI Cover Letter
    const content = await generateCoverLetter(req.body);

    // Save document
    const document = await Document.create({
      user: req.user._id,
      type: "cover-letter",
      title: `Cover Letter for ${req.body.company} - ${req.body.jobTitle}`,
      content,
    });

    res.status(200).json({
      success: true,
      message: "Cover letter generated successfully",
      credits: user.credits,
      document,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});


// ======================================================
// RESUME GENERATOR
// POST /api/documents/resume
// ======================================================
// Dev-only test endpoint (no auth, no DB, no AI) to validate request shape
router.post("/resume-test", async (req, res) => {
  try {
    const { name, email, education, experience } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    if (!education || !education.trim()) {
      return res.status(400).json({ message: "Education is required." });
    }

    if (!experience || !experience.trim()) {
      return res.status(400).json({ message: "Experience is required." });
    }

    // Return the serialized payload back so frontend can verify formatting
    return res.status(200).json({ success: true, payload: req.body });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/resume", protect, async (req, res) => {
  try {

    // Basic input validation BEFORE spending credits
    const { name, email, education, experience } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    if (!education || !education.trim()) {
      return res.status(400).json({ message: "Education is required." });
    }

    if (!experience || !experience.trim()) {
      return res.status(400).json({ message: "Experience is required." });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let user = req.user;
    let creditsLeft = user.credits ?? 999;

    if (dbConnected) {
      user = await User.findById(req.user._id);
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      if (user.credits < 1) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      user.credits -= 1;
      await user.save();
      creditsLeft = user.credits;
    }

    const content = await generateResume(req.body);

    let document;
    if (dbConnected) {
      document = await Document.create({
        user: req.user._id,
        type: "resume",
        title: `Resume - ${req.body.name || "My Resume"}`,
        content,
        metadata: {
          education: req.body.education,
          experience: req.body.experience,
          skills: req.body.skills,
        },
      });
    } else {
      document = {
        _id: "dev-resume",
        user: req.user._id,
        type: "resume",
        title: `Resume - ${req.body.name || "My Resume"}`,
        content,
        metadata: {
          education: req.body.education,
          experience: req.body.experience,
          skills: req.body.skills,
        },
        createdAt: new Date(),
      };
    }

    res.status(200).json({
      success: true,
      message: "Resume generated successfully",
      credits: creditsLeft,
      document,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});


// ======================================================
// PORTFOLIO GENERATOR
// POST /api/documents/portfolio
// ======================================================
router.post("/portfolio", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (user.credits < 1) {
      return res.status(400).json({
        message: "Insufficient credits",
      });
    }

    user.credits -= 1;
    await user.save();

    const content = await generatePortfolio(req.body);

    const document = await Document.create({
      user: req.user._id,
      type: "portfolio",
      title: `Portfolio - ${req.body.name || "My Portfolio"}`,
      content,
    });

    res.status(200).json({
      success: true,
      message: "Portfolio generated successfully",
      credits: user.credits,
      document,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});


// ======================================================
// GET ALL USER DOCUMENTS
// GET /api/documents/my-documents
// ======================================================
router.get("/my-documents", protect, async (req, res) => {
  try {
    const dbConnected = mongoose.connection.readyState === 1;

    // Development mode: no MongoDB
    if (!dbConnected) {
      return res.status(200).json([]);
    }

    const documents = await Document.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(documents);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;