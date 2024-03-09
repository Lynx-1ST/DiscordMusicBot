const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, player, track) => {
    if (!player) return;

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    console.log(`Error when loading song! Track error is in [${player.guildId}]`);

    if (player.queue.length > 0 || player.queue.size !== 0 ) {
        await player.stop();

        return channel.send({ embeds: [embed] });
    } else {
        await player.destroy();

        const embed = new EmbedBuilder().setDescription(`\`❌\` | Lỗi khi tạo bản nhạc: \`Tự động dừng\``).setColor(client.color);

        return channel.send({ embeds: [embed] });
    }
};
