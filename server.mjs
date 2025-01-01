import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 5001;

app.use(express.json());
app.use(express.static('public')); // For serving static files like HTML, JS, CSS

// Endpoint to handle the snap and send it to the recipient
app.post('/send-snap', async (req, res) => {
  const { image, recipientId } = req.body;
  const imageBuffer = Buffer.from(image.split(',')[1], 'base64'); // Convert to buffer

  // You would typically store the image and send it via Discord DM
  try {
    const response = await fetch(`https://discord.com/api/v9/users/${recipientId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: 'You received a snap! Tap to open!',
        files: [
          {
            attachment: imageBuffer,
            name: 'snap.png',
          },
        ],
      }),
    });

    if (response.ok) {
      res.status(200).send('Snap sent successfully!');
    } else {
      res.status(500).send('Error sending snap');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending snap');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});