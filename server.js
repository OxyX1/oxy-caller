import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';
import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Endpoint to generate image based on user input
app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  const payload = {
    prompt: prompt,
    output_format: 'webp',
  };

  try {
    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          Accept: 'image/*',
        },
      }
    );

    if (response.status === 200) {
      fs.writeFileSync('./public/generated_image.webp', Buffer.from(response.data));
      res.status(200).json({ message: 'Image generated successfully' });
    } else {
      res.status(response.status).json({ error: response.data.toString() });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the generated image
app.get('/image', (req, res) => {
  res.sendFile(path.resolve('public/generated_image.webp'));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
