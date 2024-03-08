const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    if (player.queue.length) return;

    if (player.message) await player.message.delete();

    // This will prevent the bot from being disconnected/destroyed when the queue ends if 247 is activated
    const data = await Reconnect.findOne({ guild: player.guildId });

    if (data && Date.now() >= data.time) {
        await data.delete();
    } // Disable this "if" when 247 command settings premium is set to "false".

    if (data) return;

    // Add a delay before disconnecting
    const disconnectDelay = 90000; // Delay in milliseconds (90 seconds in this example)

    const embed = new EmbedBuilder()
        .setDescription(`\`⏳\` | Đang chờ ${disconnectDelay / 1000} giây trước khi ngắt kết nối...`)
        .setColor(client.color);

    const waitingMessage = await channel.send({ embeds: [embed] });

    setTimeout(async () => {
        await player.destroy();

        const finalEmbed = new EmbedBuilder()
            .setDescription(`\`👋\` | Đã ngắt kết nối...!!! Do hàng đợi trống. Điều này có thể được vô hiệu hóa bằng cách sử dụng lệnh \`247\`.`)
            .setColor(client.color);

        // Delete the waiting message after disconnecting
        await waitingMessage.delete();

        return channel.send({ embeds: [finalEmbed] });
    }, disconnectDelay);
};
