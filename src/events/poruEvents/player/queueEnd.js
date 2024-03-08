const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    if (player.queue.length) return;

    if (player.message) await player.message.delete();

    const data = await Reconnect.findOne({ guild: player.guildId });

    if (data && Date.now() >= data.time) {
        await data.delete();
    } // Disable this "if" when 247 command settings premium is set to "false".

    if (data) return;

    // Set the countdown duration in milliseconds
    const countdownDuration = 90000; // 90 seconds in this example

    const embed = new EmbedBuilder()
        .setDescription(`\`🕒\` | Đếm ngược trước khi ngắt kết nối: ${countdownDuration / 1000} giây`)
        .setColor(client.color);

    const countdownMessage = await channel.send({ embeds: [embed] });

    // Countdown logic
    let remainingTime = countdownDuration;
    const interval = 1000; // Update every second

    const countdownInterval = setInterval(() => {
        remainingTime -= interval;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            return;
        }

        // Update the embed description with remaining time
        embed.setDescription(`\`🕒\` | Đếm ngược trước khi ngắt kết nối: ${Math.ceil(remainingTime / 1000)} giây`);
        countdownMessage.edit({ embeds: [embed] });
    }, interval);

    // Disconnect player after countdown finishes
    setTimeout(async () => {
        clearInterval(countdownInterval); // Stop the countdown interval
        await player.destroy();

        const finalEmbed = new EmbedBuilder()
            .setDescription(`\`👋\` | Đã ngắt kết nối...!!! Do hàng đợi trống. Điều này có thể được vô hiệu hóa bằng cách sử dụng lệnh \`247\`.`)
            .setColor(client.color);

        return channel.send({ embeds: [finalEmbed] });
    }, countdownDuration);
};
