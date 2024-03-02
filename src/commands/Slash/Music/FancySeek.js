const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "seek",
    description: "Tìm kiếm bài hát đang phát.",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "Độ dài vị trí mới của bài hát.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 0,
        },
    ],
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const player = client.poru.players.get(interaction.guild.id);

        const position = interaction.options.getNumber("seconds", true);
        const Duration = formatDuration(position * 1000);

        if (!player.currentTrack.info.isSeekable) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\✖️\ | Bài hát không thể tìm kiếm được`);

            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.seekTo(position * 1000);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Bài hát được tìm: \`${Duration}\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
