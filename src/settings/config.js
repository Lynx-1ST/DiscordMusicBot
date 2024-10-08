require("dotenv").config();

module.exports = {

  token: process.env.TOKEN || "MTIwMzc0NDcwNjcwMjYxMDUyMg.GHaZku.jq2kivnDk8FRzWpAiRVwFTqPaaMaxfy6FuBxRw", // <==== PASTE YOU TOKEN
  prefix: process.env.PREFIX || "+", // <==== SET YOU PRERIX BOT [ OWNER COMMANDS ]
  color: process.env.EMBED_COLOR || "#2f3136", // <==== YOU EMBEDED HEX COLOR
  owner: process.env.OWNER_ID || "1081547609979756596", // <==== BOTS OWNER ID
  guildLogs: process.env.GUILD_LOGS || "1203748123961327707", // <==== YOUR SERVER JOIN LEFT LOGS CHANNEL ID
  leaveTimeout: process.env.LEAVE_TIMEOUT || "60000", // <==== SET LEAVE TIMEOUT WHEN BOT WAS ALONE || 1000 = 1sec
  disableYouTube: parseBoolean(process.env.DISABLE_YOUTUBE || "false"), // <==== SET "TRUE OR FALSE" | ENABLE/DISABLE YOUTUBE FEATURES. DISABLING THIS WILL MAKE "AUTOPLAY" COMMANDS USELESS!!!

  // ⬇⬇⬇ PORU DETAILS
  playSource: process.env.PLAY_SOURCE || "ytsearch", // <==== SET YOUR PLAY SOURCE || "ytsearch","ytmsearch","scsearch"
  poruOptions: {
    defaultPlatform: process.env.DEFAULT_SOURCE || "ytsearch", // <==== SET DEFAULT SOURCE || "ytsearch","ytmsearch","scsearch"
    clientID: process.env.SPOTIFY_ID || "", // <==== SPOTIFY CLIENT ID
    clientSecret: process.env.SPOTIFY_SECRET || "", // <==== SPOTIFY CLIENT SECRET
    reconnectTries: Infinity, // <==== TOTAL ATTEMPS TO TRY IF RECONNECT FAILED. YOU CAN CHANGE IT TO "Infinity" FOR UNLIMITED ATTEMPS.
    playlistLimit: 2, // <==== 1 = 100 TRACKS
    albumLimit: 2, // <==== 1 = 50 TRACKS
    artistLimit: 2, // <==== 1 = 50 TRACKS
    searchMarket: "en",
  },
  nodes: [
    {
      name: process.env.NODE_NAME1 || "",
      host: process.env.NODE_HOST1 || "",
      port: parseInt(process.env.NODE_PORT1 || ""),
      password: process.env.NODE_PASSWORD1 || "",
      secure: parseBoolean(process.env.NODE_SECURE1 || "false"),
      regions: process.env.NODE_REGIONS1 || [""],
    }
  ],


  mongoUri: process.env.MONGO_URI || "mongodb+srv://maihang987th:loc.1005@discord.xhm84ds.mongodb.net/?retryWrites=true&w=majority", 
  supportUrl: process.env.SUPPORT_URL || "https://github.com/Lynx-1ST",
  voteUrl: process.env.VOTE_URL || "https://github.com/Lynx-1ST",
  inviteUrl: process.env.INVITE_URL || "", 
  imageUrl: process.env.IMAGE_URL || "https://imgs.search.brave.com/jwLHIDhA6haNZYN37vbglCjO18R8DhLrrryE349pjQY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9naWZk/Yi5jb20vaW1hZ2Vz/L2hpZ2gvYW5pbWUt/YmFubmVyLWdpZi1m/aWxlLTQ3N2tiLXU5/OHhoYnZqeXppM2gz/YWouZ2lm.gif",
};

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case "true":
      return true;
    default:
      return false;
  }
}

