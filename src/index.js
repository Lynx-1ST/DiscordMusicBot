const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});
app.listen(3000, () => {
  console.log('[INFO] Bot Online!');
});
const MainClient = require("./fancy.js");
const client = new MainClient();

client.connect();

// Start Lavalink
const lavalink = require('lavalink');
const nodes = [
  { host: 'localhost', port: 2333, region: 'singapore', password: 'loc.1005' }
];
const manager = new lavalink.Manager(nodes, {
  user: client.user.id,
  shards: 1
});
manager.connect();

module.exports = client;