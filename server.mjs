import express from "express";
import bodyParser from "body-parser";
import { WebhookClient } from "discord.js";
import dotenv from "dotenv";
import cors from "cors";

// Allow requests from your front-end domain
const corsOptions = {
  origin: ["https://snipcord.vercel.app"], // Replace with your actual front-end URLs
  methods: "GET,POST", // Allow only the required methods
  allowedHeaders: ["Content-Type"], // Allow only necessary headers
};

app.use(cors(corsOptions));


dotenv.config();

// Initialize the Express app
const app = express();
const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

app.use(bodyParser.json()); // Middleware to parse JSON requests

// Handle POST request for the snap
app.post("/sendSnap", async (req, res) => {
  const { recipientId, imageData } = req.body;

  if (!recipientId || !imageData) {
    console.error("Missing recipient ID or image data");
    return res.status(400).json({ error: "Recipient ID or image data is missing" });
  }

  console.log("Received POST request to /sendSnap");
  console.log("Recipient ID:", recipientId);
  console.log("Image data length:", imageData.length); // Log the size of the image data

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
    // Extract the base64 data, ignoring the prefix
    const base64Data = imageData.split(",")[1]; // Removes "data:image/png;base64,"
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Send the image via the Discord webhook
    const message = await webhook.send({
      content: `You have a new snap from <@${recipientId}>! 👀 (Tap to view)`,
      files: [{ attachment: imageBuffer, name: "snap.png" }],
    });

    console.log("Snap sent successfully!");

    // Delete the message after 10 seconds
    setTimeout(() => {
      message.delete().catch((err) => console.error("Error deleting message:", err));
      console.log("Snap deleted after 10 seconds.");
    }, 10000);
  } catch (error) {
    console.error("Error sending snap:", error);
    throw error;
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//curl -X POST -H "Content-Type: application/json" -d '{"content": "Test message from webhook"}' https://${process.env.TUNNEL_SUBDOMAIN}.loca.lt/sendSnap