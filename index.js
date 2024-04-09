const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');


app.use(express.json());
app.use(cors());

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyAPgIa2nvV3xnblYjcJsPZkjCNrAZO_kxY');

// Define your route handler
app.post('/generate-response', async (req, res) => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
   
    // Example message from user
    const msg = req.body.message;
    if (!msg) {
      return res.status(400).json({ error: 'Message is required in the request body' });
    }

    const chat = model.startChat({
      history : [
        {
          role: "user",
          parts: [{ text: "Hello, I have 2 dogs in my house." }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
      },
    });

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = await response.text();

    // Send the generated response back to the client
    res.json({
       text
    });
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
