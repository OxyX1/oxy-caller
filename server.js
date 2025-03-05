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
        const response = await axios.post("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", { prompt });
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
