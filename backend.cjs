const { config } = require('dotenv');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

app.post('/api/uml', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(500).json({ error: 'Error al comunicarse con OpenRouter', details: error.response.data });
    } else {
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
