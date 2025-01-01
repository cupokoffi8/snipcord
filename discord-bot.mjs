import { Client, GatewayIntentBits } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.SNAPBOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
//const GUILD_ID = process.env.GUILD_ID; // Optional, if you want to register commands for a specific guild

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

const commands = [
  new SlashCommandBuilder()
    .setName('snap')
    .setDescription('Send a snap to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to send the snap to')
        .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID), // For testing in a specific server
      { body: commands },
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

registerCommands();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'snap') {
    const targetUser = interaction.options.getUser('user');

    if (targetUser) {
      // Send a link to the web app to take the selfie
      const selfieUrl = `https://snipcord-.vercel.app?recipient=${targetUser.id}`;
      await interaction.reply({
        content: `Click this link to take a selfie and send it to ${targetUser.username}: ${selfieUrl}`,
        ephemeral: true, // Only visible to the user invoking the command
      });
    }
  }
});

client.login(TOKEN);