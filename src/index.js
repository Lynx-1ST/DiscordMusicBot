const express = require('express');
const { Client } = require('discord.js');
const { Manager } = require('lavacord');
const MainClient = require("./fancy.js");

const app = express();
const client = new Client();
const manager = new Manager({
  nodes: [{ host: 'localhost', port: 2333, password: 'loc.1005', region: 'singapore' }],
  send: (guild, packet) => {
    const guildId = typeof guild === 'string' ? guild : guild.id;
    const shard = client.guilds.cache.get(guildId)?.shard;
    if (shard) return shard.send(packet);
    else return client.shard.broadcastEval(`this.guilds.cache.get('${guildId}')?.shard.send(${JSON.stringify(packet)})`);
  }
});

// Discord bot
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.login('YOUR_DISCORD_BOT_TOKEN');

// Lavalink manager
manager.on('ready', () => {
  console.log('Lavalink is ready!');
});

// Express route
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[INFO] Bot Online! Listening on port ${port}`);
});

// Export the Discord bot client
module.exports = client;
