const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, player) => {
    if (!player) return;

    if (player.message) await player.message.delete().catch(console.error);

    if (!player.currentTrack) return;

    if (player.autoplay === true) {
        try {
            const trackSearch = player.currentTrack.info;

            const ytUri = /^(https?:\/\/)?(www\.)?(m\.)?(music\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(trackSearch.uri);

            if (ytUri) {
                const source = client.config.playSource;
                const identifier = trackSearch.identifier;
                const search = `https://music.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                const res = await client.poru.resolve(search, source);

                for (const track of res.tracks) {
                    track.info.requester = trackSearch.requester;
                }

                const randomIndex = Math.floor(Math.random() * res.tracks.length);
                await player.queue.add(res.tracks[randomIndex]);
            }
        } catch (error) {
            console.error("Error fetching YouTube track:", error);
            // Handle the error here, for example: notify the user or perform other actions
            const channel = client.channels.cache.get(player.textChannel);
            if (!channel) return;
            const embed = new EmbedBuilder().setDescription(`\`❌\` | Đã xảy ra lỗi khi tải bài hát: \`${error.message}\``).setColor(client.color);
            return channel.send({ embeds: [embed] }).catch(console.error);
        }
    }
};
