const express = require('express');
const router = express.Router();
const { chatWithConcierge } = require('../controllers/aiController');

// @route   POST /api/ai/chat
// @desc    Chat with AI Luxury Concierge
// @access  Public
router.post('/chat', chatWithConcierge);

module.exports = router;
