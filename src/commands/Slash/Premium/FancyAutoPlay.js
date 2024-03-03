const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "autoplay",
    description: "Tự động phát/số bài hát liên quan ngẫu nhiên.",
    category: "Premium",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true});

        const player = client.poru.players.get(interaction.guild.id);

        if (!player || !player.currentTrack) {
            const embed = new EmbedBuilder().setDescription(`\✖️\ | Hiện không có bài hát nào đang phát!`).setColor(client.color);
            return interaction.editReply({embeds: [embed]});
        }

        const currentsong = player.currentTrack.info;

        if (!currentsong || !currentsong.uri) {
            const embed = new EmbedBuilder().setDescription(`\✖️\ | Không thể lấy thông tin của bài hát hiện tại!`).setColor(client.color);
            return interaction.editReply({embeds: [embed]});
        }

        const ytUri = /^(https?:\/\/)?(www\.)?(m\.)?(music\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(currentsong.uri);

        if (!ytUri) {
            const embed = new EmbedBuilder().setDescription(`\✖️\ | Tính năng tự động phát chỉ hỗ trợ YouTube!`).setColor(client.color);
            return interaction.editReply({embeds: [embed]});
        }

        if (player.autoplay === true) {
            player.autoplay = false;
            await player.queue.clear();

            const embed = new EmbedBuilder().setDescription(`\`🔴\` | Tự động phát đã: \`TẮT\``).setColor(client.color);
            return interaction.editReply({embeds: [embed]});
        } else {
            player.autoplay = true;

            if (ytUri) {
                const identifier = currentsong.identifier;
                const search = `https://music.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                const res = await client.poru.resolve(search);

                for (const track of res.tracks) {
                    track.info.requester = currentsong.requester;
                }

                await player.queue.add(res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 1]);

                const embed = new EmbedBuilder().setDescription(`\`🔵\` | Tự động phát đã: \`BẬT\``).setColor(client.color);
                return interaction.editReply({embeds: [embed]});
            }
        }
    }
}
