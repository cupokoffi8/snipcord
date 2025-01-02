import express from "express";
import bodyParser from "body-parser";
import { WebhookClient } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Express app
const app = express();
const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

app.use(bodyParser.json()); // Middleware to parse JSON requests

// Handle POST request for the snap
app.post("/sendSnap", async (req, res) => {
  const { recipientId, imageData } = req.body;

  if (!recipientId || !imageData) {
    return res.status(400).json({ error: "Recipient ID or image data is missing" });
  }

  try {
    // Send the image using the sendSnapImage function
    await sendSnapImage(imageData, recipientId);

    res.status(200).json({ message: "Snap sent successfully!" });
  } catch (error) {
    console.error("Error sending snap:", error);
    res.status(500).json({ error: "Error sending snap" });
  }
});

// Function to send the snap image to Discord using the webhook
async function sendSnapImage(imageData, recipientId) {
  try {
    const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
    const attachment = { files: [{ attachment: imageBuffer, name: "snap.png" }] };

    const message = await webhook.send({
      content: `You have a new snap from <@${recipientId}>! 👀 (Tap to view)`,
      ...attachment,
    });

    // Delete the message after 10 seconds (mimicking Snapchat feature)
    setTimeout(() => {
      message.delete();
    }, 10000); // 10000ms = 10 seconds
  } catch (error) {
    console.error("Error sending snap:", error);
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});