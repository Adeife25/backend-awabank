require('dotenv').config();
const { run } = require('ollama'); // Ollama SDK function to run a model

class AIService {
  async chat(messages, systemPrompt = '') {
    try {
      const prompt = [
        systemPrompt ? `SYSTEM:\n${systemPrompt}` : '',
        ...messages.map(m => `${m.role.toUpperCase()}:\n${m.content}`)
      ].join('\n\n');

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3',
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Local AI Error:', error);
      throw new Error('Failed to process AI request');
    }
  }

  async virtualAssistant(userMessage, conversationHistory = []) {
    const systemPrompt = `You are a professional virtual banking assistant.
- Be concise
- Never request sensitive data
- Be helpful and polite`;

    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    return this.chat(messages, systemPrompt);
  }
}

module.exports = new AIService();
