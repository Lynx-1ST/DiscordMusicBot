const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    if (player.queue.length) return;

    if (player.message) await player.message.delete();

    // this will make the bot will not be disconneted/destroyed when queue end if 247 activated
    const data = await Reconnect.findOne({ guild: player.guildId });

    if (data && Date.now() >= data.time) {
        await data.delete();
    } // Disable this "if" when 247 command settings premium is set to "false".

    if (data) return;

    // Create a timeout to delay the action by a certain amount of time
    const delay = 5000; // Đặt thời gian chờ 5 giây (5000 milliseconds) - có thể thay đổi tùy ý
    setTimeout(async () => {
        await player.destroy();

        const embed = new EmbedBuilder()
            .setDescription(`\`👋\` | Đã ngắt kết nối...!!! Do hàng đợi trống. Điều này có thể được vô hiệu hóa bằng cách sử dụng lệnh \`247\`.`)
            .setColor(client.color);

        channel.send({ embeds: [embed] });
    }, delay);
};
