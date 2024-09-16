const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "supersecretkey"; // Server's secret key
const valuableImageUrl = "https://example.com/valuable-image.jpg";

// Get original hash for URL
app.post('/api/get-original-hash', (req, res) => {
  const { originalMessage } = req.body;
  const originalHash = crypto.createHash('sha256').update(SECRET_KEY + originalMessage).digest('hex');
  res.json({ originalHash });
});

// Simulate length extension attack
app.post('/api/simulate-length-extension', (req, res) => {
  const { additionalData } = req.body;
  const originalURL = "https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?auto=compress&fm=pjpg";
  const extendedURL = originalURL + additionalData;

  const newHash = crypto.createHash('sha256').update(SECRET_KEY + extendedURL).digest('hex');

  // Simulate successful attack if data matches specific value
  if (additionalData === "&file=valuable") {
    return res.json({ success: true, newHash, imageUrl: valuableImageUrl });
  } else {
    return res.json({ success: false, newHash });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
