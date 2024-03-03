const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!');
});

app.listen(3000, () => {
  console.log('[INFO] Bot Online!');
});

const MainClient = require("./fancy.js");
const client = new MainClient();

client.connect();

// Function to send console.log to Discord webhook
function sendConsoleLogToWebhook(logMessage) {
  const webhookURL = 'https://discord.com/api/webhooks/1213861326477201419/Vo4DLVXBau_53_07XAPBgAyfxCZ98yZkM6Cr1kaEC0zE8B_96FkD5rqJl8LfNH-e5_Wl'; // Replace with your actual webhook URL

  axios.post(webhookURL, {
    content: logMessage
  }).then(response => {
    console.log('Console log sent to Discord webhook successfully.');
  }).catch(error => {
    console.error('Error sending console log to Discord webhook:', error);
  });
}

// Redirect console.log output to Discord webhook
const originalConsoleLog = console.log;
console.log = function() {
  const logMessage = Array.from(arguments).join(' ');
  sendConsoleLogToWebhook(logMessage);
  originalConsoleLog.apply(console, arguments);
};

module.exports = client;
