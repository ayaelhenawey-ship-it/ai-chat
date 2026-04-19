const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running on port 3000!' });
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`User message: "${message}"`);
    console.log('Calling Ollama API...');

    const ollamaResponse = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [{ role: 'user', content: message }],
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama returned ${ollamaResponse.status}`);
    }

    const ollamaData = await ollamaResponse.json();
    const aiReply = ollamaData.message?.content || 'No response from AI';

    console.log(` Got reply from Ollama`);
    console.log(` Sending back to frontend\n`);

    return res.json({ reply: aiReply });

  } catch (error) {
    console.error(`\n Ollama error: ${error.message}`);
    
    // Fallback response in English as requested
    const fallbackReply = `I received your message: "${req.body.message}", but I couldn't reach Ollama. Make sure "ollama serve" is running!`;
    res.json({ reply: fallbackReply });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`BACKEND SERVER STARTED`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📡 Ollama: http://localhost:11434`);
  console.log(`✨ Model: llama3`);
  console.log(`✨ Ready for chat requests\n`);
});
