const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const webhook = process.env.DISCORD_WEBHOOK;
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

const MainClient = require("./fancy.js");
const client = new MainClient();
client.connect();
module.exports = client;

console.log(webhook);
app.use(bodyParser.json());
// Xử lý webhook từ Heroku
app.post('/heroku-webhook', (req, res) => {
    // Trích xuất dữ liệu từ payload của Heroku
    const eventData = req.body;
    // Định dạng thông điệp Discord
    const discordPayload = {
        embeds: [
            {
                title: 'Heroku Event',
                description: `Event type: ${eventData.event}`,
                // Thêm thông tin khác tùy thuộc vào sự kiện Heroku
            },
        ],
    };
    // Gửi thông điệp định dạng đến webhook Discord
    axios.post(webhook, discordPayload)
        .then(() => {
            res.status(200).send('Success');
        })
        .catch((error) => {
            console.error('Error sending Discord webhook:', error);
            res.status(500).send('Error');
        });
});

  app.listen(3000, () => {
  console.log('[INFO] Bot Online!');
});
