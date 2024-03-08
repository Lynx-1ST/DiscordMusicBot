const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, player) => {
    if (!player || !player.currentTrack) return;

    if (player.message) await player.message.delete();

    try {
        const trackSearch = player.currentTrack.info;
        const ytUri = /^(https?:\/\/)?(www\.)?(m\.)?(music\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(trackSearch.uri);
        if (ytUri && player.autoplay === true) {
            const source = client.config.playSource;
            const identifier = trackSearch.identifier;
            const search = `https://music.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await client.poru.resolve(search, source);
            for (const track of res.tracks) {
                track.info.requester = trackSearch.requester;
            }
            await player.queue.add(res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 2]);
        }
    } catch (error) {
        console.error("Error fetching YouTube track:", error);
        // Xử lý lỗi ở đây, ví dụ: thông báo cho người dùng hoặc thực hiện hành động khác
        const channel = client.channels.cache.get(player.textChannel);
        if (!channel) return;
        const embed = new EmbedBuilder().setDescription(`\`❌\` | Đã xảy ra lỗi khi tải bài hát: \`${error.message}\``).setColor(client.color);
        return channel.send({ embeds: [embed] });
    }
};
