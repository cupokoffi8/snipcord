# Snipcord

Snipcord brings Snapchat-like functionality to Discord, allowing users to send ephemeral snaps (selfies) to each other directly within Discord! The snaps are sent as spoiler-protected images that disappear after a set duration, replicating the ephemeral experience of Snapchat.

## Features
- **Snap Command**: Use the `/snap` command in Discord to send a snap to a specified user.
- **Selfie Capture**: Open a generated link to capture a selfie using your device's camera.
- **Spoiler Filter**: Snaps are sent as spoiler-protected images in Discord, ensuring privacy until the recipient chooses to view them.
- **Ephemeral Messaging**: Snaps automatically delete from Discord after 10 seconds, mimicking Snapchat's disappearing messages.

## How It Works
1. **Slash Command**: In Discord, use `/snap @username` to generate a link for capturing a selfie.
2. **Selfie Capture**: The link opens a web app (hosted on Vercel) that lets you capture a selfie using your device's camera.
3. **Image Processing**: The captured image is sent to a backend server (hosted on Fly.io), where it is formatted and sent to Discord via a webhook.
4. **Delivery**: The recipient receives a spoiler-protected snap in Discord that they can click to view. The snap disappears 10 seconds after being sent.

## Project Architecture
- **Frontend**: 
  - Hosted on **Vercel** at [https://snipcord.vercel.app](https://snipcord.vercel.app).
  - Provides the UI for capturing selfies and communicating with the backend.
  - Built with responsive design for mobile and desktop compatibility.

- **Backend**:
  - Hosted on **Fly.io** at [https://snipcord.fly.dev](https://snipcord.fly.dev).
  - Handles processing the selfie image and sending it to Discord using the webhook.

- **Discord Bot**:
  - Implements the `/snap` slash command to generate selfie links.
  - Sends ephemeral snaps to users in Discord.

## Setup and Deployment
### Prerequisites
- Node.js and npm installed.
- A Discord bot with the required permissions in your server.
- Accounts on Vercel and Fly.io for hosting.

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/cupokoffi8/snipcord.git
   cd snipcord


# Deploy to VERCEL
npm run deploy
🔗  Linked to cupokoffi8s-projects/snipcord (created .vercel and added it to .gitignore)
🔍  Inspect: https://vercel.com/cupokoffi8s-projects/snipcord/3usTKPntAmbYGxCAN9JBzJCrscme [3s]     
✅  Production: https://snipcord.vercel.app [3s]
📝  Deployed to production. Run `vercel --prod` to overwrite later (https://vercel.link/2F).

# Run Bot
npm run bot