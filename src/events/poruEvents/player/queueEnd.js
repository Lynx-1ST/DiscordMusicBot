const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel || player.queue.length) return;

    if (player.message) await player.message.delete();

    const data = await Reconnect.findOne({ guild: player.guildId });
    if (data) {
        if (Date.now() >= data.time) await data.delete();
        else return;
    }
    
    const disconnectDelay = 90000; // 90 seconds
    const embed = new EmbedBuilder()
        .setDescription(`\`⏳\` | Đang đợi ${disconnectDelay / 1000} giây trước khi ngắt kết nối .... `)
        .setColor(client.color);
    const waitingMessage = await channel.send({ embeds: [embed] });

    setTimeout(async () => {
        await player.destroy();
        await waitingMessage.delete();
        const finalEmbed = new EmbedBuilder()
            .setDescription(`\`👋\` | Đã ngắt kết nối do hàng đợi trống !!! Điều này có thể được vô hiệu hóa bằng cách sử dụng lệnh `247`.`)
            .setColor(client.color);
        channel.send({ embeds: [finalEmbed] });
    }, disconnectDelay);
};
