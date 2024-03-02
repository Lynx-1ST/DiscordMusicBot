const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    // If 247 activated, this will auto connect voice when bot disconnected/destoryed
    const data = await Reconnect.findOne({ guild: player.guildId });

    if (data && Date.now() >= data.time) {
        await data.delete();

        console.log(`[INFO] 247 has been disabled from (${player.guildId})`);
    } // Disable this "if" when 247 command settings premium is set to "false".
    if (data) {
        const voices = client.channels.cache.get(data.voice);

        // Create a timeout to delay the action by a certain amount of time
        const delay = 60000; // Đặt thời gian chờ 5 giây (5000 milliseconds) - có thể thay đổi tùy ý
        setTimeout(async () => {
            if (player.state !== "DESTROYING") {
                await client.poru.createConnection({
                    guildId: data.guild,
                    voiceChannel: data.voice,
                    textChannel: data.text,
                    region: voices.rtcRegion || undefined,
                    deaf: true,
                });
            }
        }, delay);
    }
//

    console.log(`[DEBUG] Player Destroyed from (${player.guildId})`);
}

