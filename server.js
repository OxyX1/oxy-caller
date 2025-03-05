import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';

const payload = {
  prompt: 'Lighthouse on a cliff overlooking the ocean',
  output_format: 'webp'
};

const response = await axios.post(
  `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
  axios.toFormData(payload, new FormData()),
  {
    validateStatus: undefined,
    responseType: 'arraybuffer',
    headers: { 
      Authorization: `Bearer sk-8TZjFXoWC0lgREyuaAZokT1oVDeVmvCbcYWWsf1G14XzgFr2`, 
      Accept: 'image/*'
    },
  }
);

if(response.status === 200) {
  fs.writeFileSync('./lighthouse.webp', Buffer.from(response.data));
  console.log("✅ Image saved as lighthouse.webp!");
} else {
  throw new Error(`${response.status}: ${response.data.toString()}`);
}
