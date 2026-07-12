const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Development mode - allow registration without database
    if (process.env.NODE_ENV !== 'production') {
      const token = jwt.sign({ userId: 'dev-' + Date.now(), userName: name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
      return res.json({ token, user: { id: 'dev-' + Date.now(), email, name } });
    }

    // Production mode - check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password is auto-hashed in the model)
    user = new User({ name, email, password });
    await user.save();

    // Generate Token
    const token = jwt.sign({ userId: user._id, userName: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Development mode - allow login without database
    if (process.env.NODE_ENV !== 'production') {
      const token = jwt.sign({ userId: 'dev-' + Date.now(), userName: 'Dev User' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
      return res.json({ token, user: { id: 'dev-' + Date.now(), email } });
    }

    // Production mode - check user credentials
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate Token
    const token = jwt.sign({ userId: user._id, userName: user.name}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user (Protected Route)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;