const express = require('express');
const router = express.Router();

const { virtualAssistant } = require('../controller/aiController');
const { protect } = require('../middleware/auth'); // optional auth

// Protected virtual assistant route
router.post('/chat', protect, virtualAssistant);

module.exports = router;

