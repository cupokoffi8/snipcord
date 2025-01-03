import { Client, GatewayIntentBits, REST } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = process.env.SNAPBOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("snap")
    .setDescription("Send a snap to a user")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user to send the snap to")
        .setRequired(true)
    ),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

// Register commands
(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
})();

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand() || interaction.commandName !== "snap") return;

  const targetUser = interaction.options.getUser("user");

  if (targetUser) {
    const selfieUrl = `https://snipcord.fly.dev?recipient=${targetUser.id}`;
    await interaction.reply({
      content: `Click this link to take a selfie and send it to ${targetUser.username}: ${selfieUrl}`,
      ephemeral: true,
    });
  }
});

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

client.login(TOKEN);