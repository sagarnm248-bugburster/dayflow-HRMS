const express = require('express');
const router = express.Router();
const { getDB } = require('../../config/db');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      success: true,
      reply: "AI Chat integration is currently running in offline preview mode. Set `GEMINI_API_KEY` in environment variables for live AI responses."
    });
  }

  try {
    const systemPrompt = "You are an AI HR Assistant. Help employees and admins with HR inquiries politely, concisely, and professionally.";
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AI API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    return res.json({ success: true, reply });
  } catch (err) {
    console.error("❌ AI Chat Error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to process AI chat request" });
  }
});

module.exports = router;
