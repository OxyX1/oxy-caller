const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Serve index.html on root ('/')
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Image generation endpoint
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const API_URL = process.env.API_URL || "https://api.openai.com/v1/images/generations"; // Use correct URL
    const API_KEY = process.env.OPENAI_API_KEY; // Load API Key from .env

    if (!API_KEY) {
        return res.status(500).json({ error: "Missing OpenAI API Key" });
    }

    try {
        const response = await axios.post(
            API_URL,
            { prompt },
            { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ imageUrl: response.data.data[0].url });
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Image generation failed." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
