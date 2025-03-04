const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Set up API endpoint
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        // If using OpenAI DALL·E API
        const response = await axios.post(
            "https://api.openai.com/v1/images/generations",
            {
                prompt,
                n: 1,
                size: "1024x1024",
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ imageUrl: response.data.data[0].url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Image generation failed." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
