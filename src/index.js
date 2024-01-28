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

module.exports = client;

/**
 * @INFO
 * Bot Coded by WhoFancy?#0000 | https://dsc.gg/allpbprivate
 * @INFO
 * Work for Fancy Music | https://dsc.gg/allpbprivate
 * @INFO
 * Please Mention Us Fancy Music, When Using This Code!
 * @INFO
 */
