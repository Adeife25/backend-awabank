const AIService = require('../services/aiService');

exports.virtualAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await AIService.virtualAssistant(
      message,
      history || []
    );

    res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Virtual assistant failed'
    });
  }
};
