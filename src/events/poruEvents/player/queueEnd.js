const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    if (player.queue.length) return;

    if (player.message) await player.message.delete();

    // Kiểm tra nếu đã cài đặt 247 và đã đến thời gian ngắt kết nối
    const data = await Reconnect.findOne({ guild: player.guildId });
    if (data && Date.now() >= data.time) {
        await data.delete();
    }

    // Nếu có cài đặt 247, không thực hiện ngắt kết nối
    if (data) return;

    // Thêm thông báo thời gian chờ trước khi ngắt kết nối
    const disconnectDelay = 90000; // 90 giây
    const embed = new EmbedBuilder()
        .setDescription(`\`⏳\` | Đang chờ ${disconnectDelay / 1000} giây trước khi ngắt kết nối...`)
        .setColor(client.color);
    const waitingMessage = await channel.send({ embeds: [embed] });

    // Đặt hẹn giờ để ngắt kết nối sau thời gian chờ
    setTimeout(async () => {
        await player.destroy();

        // Xoá thông báo chờ đợi sau khi ngắt kết nối
        await waitingMessage.delete();

        // Gửi thông báo sau khi ngắt kết nối
        const finalEmbed = new EmbedBuilder()
            .setDescription(`\`👋\` | Đã ngắt kết nối...!!! Do hàng đợi trống. Điều này có thể được vô hiệu hóa bằng cách sử dụng lệnh \`247\`.`)
            .setColor(client.color);
        return channel.send({ embeds: [finalEmbed] });
    }, disconnectDelay);
};
