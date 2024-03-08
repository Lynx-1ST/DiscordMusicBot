const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    if (player.queue.length) return;

    if (player.message) await player.message.delete();

    // this will make the bot will not be disconnected/destroyed when queue end if 247 activated
    const data = await Reconnect.findOne({ guild: player.guildId });

    if (data && Date.now() >= data.time) {
        await data.delete();
    } // Disable this "if" when 247 command settings premium is set to "false".

    if (data) return;
    //

    // Add a delay before disconnecting
    const disconnectDelay = 90000; // Delay in milliseconds (5 seconds in this example)

    const embed = new EmbedBuilder()
        .setDescription(`\`⏳\` | Đang chờ ${disconnectDelay / 1000} giây trước khi ngắt kết nối...`)
        .setColor(client.color);

    const waitingMessage = await channel.send({ embeds: [embed] });

    const timer = setTimeout(async () => {
        await player.destroy();

        const finalEmbed = new EmbedBuilder()
            .setDescription(`\`👋\` | Đã ngắt kết nối sau ${disconnectDelay / 1000} giây. Hàng đợi trống. Điều này có thể được vô hiệu hóa bằng cách sử dụng lệnh \`247\`.`)
            .setColor(client.color);

        // Delete the waiting message after disconnecting
        await waitingMessage.delete();
        return channel.send({ embeds: [finalEmbed] });
    }, disconnectDelay);

    // Listen for new tracks added to the queue
    player.on("trackAdd", async () => {
        // If a new track is added, cancel the timer and delete the waiting message
        clearTimeout(timer);
        await waitingMessage.delete();
    });

    // Listen for queue end
    player.on("queueEnd", async () => {
        // If the queue ends prematurely, delete the waiting message
        await waitingMessage.delete();
    });
};
