const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "remove",
    description: "Remove a song from the queue.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "Position of the song.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
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
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const player = client.poru.players.get(interaction.guild.id);
        const track = interaction.options.getNumber("position");

        if (track > player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\✖️\ | Không tìm thấy bài hát`);

            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.remove(track - 1);

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`<a:check_mark:1213409895483965490> | Bài hát đã: \`Gỡ bở\``);

        return interaction.editReply({ embeds: [embed] });
    },
};
