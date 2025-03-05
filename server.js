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

    try {
        const response = await axios.post("YOUR_AI_API_URL", { prompt });
        res.json({ imageUrl: response.data.imageUrl });
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Image generation failed." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
