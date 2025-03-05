import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Log each request to the server
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Endpoint to generate image based on user input
app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  console.log(`Generating image for prompt: ${prompt}`);
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
          Authorization: `Bearer sk-8TZjFXoWC0lgREyuaAZokT1oVDeVmvCbcYWWsf1G14XzgFr2`,
          Accept: 'image/*',
        },
      }
    );

    if (response.status === 200) {
      const imagePath = './public/generated_image.webp';
      fs.writeFileSync(imagePath, Buffer.from(response.data));
      console.log(`✅ Image saved as ${imagePath}`);
      res.status(200).json({ message: 'Image generated successfully' });
    } else {
      console.error(`API Error: ${response.status} - ${response.data.toString()}`);
      res.status(response.status).json({ error: response.data.toString() });
    }
  } catch (error) {
    console.error(`Catch Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Serve the generated image
app.get('/image', (req, res) => {
  const imagePath = path.resolve('public/generated_image.webp');
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send('Image not found');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
