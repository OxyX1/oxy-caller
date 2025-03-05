import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';
import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

const payload = {
  prompt: 'Lighthouse on a cliff overlooking the ocean',
  output_format: 'webp',
};

async function generateImage() {
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
    fs.writeFileSync('./lighthouse.webp', Buffer.from(response.data));
    console.log("✅ Image saved as lighthouse.webp!");
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
}

app.use(express.static('public'));

// Serve the generated image
app.get('/image', (req, res) => {
  res.sendFile(path.resolve('lighthouse.webp'));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  generateImage(); // Generate image when server starts
});
