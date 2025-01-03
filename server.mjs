import express from "express";
import { WebhookClient } from "discord.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Express app
const app = express();
const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

app.use(bodyParser.json());

// Endpoint to handle the snap
app.post("/sendSnap", async (req, res) => {
  const { recipientId, imageData } = req.body;

  if (!recipientId || !imageData) {
    console.error("Recipient ID or image data is missing");
    return res.status(400).json({ error: "Recipient ID or image data is missing" });
  }

  try {
    // Process and send the snap
    const base64Data = imageData.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    const message = await webhook.send({
      content: `You have a new snap from <@${recipientId}>! 👀`,
      files: [{ attachment: imageBuffer, name: "snap.jpg" }],
    });

    console.log("Snap sent successfully:", message.id);

    // Auto-delete the message after 10 seconds
    setTimeout(async () => {
      try {
        await message.delete();
        console.log("Snap deleted after 10 seconds");
      } catch (err) {
        console.error("Error deleting snap:", err);
      }
    }, 10000);

    res.status(200).json({ message: "Snap sent successfully!" });
  } catch (error) {
    console.error("Error sending snap:", error);
    res.status(500).json({ error: "Failed to send snap" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});