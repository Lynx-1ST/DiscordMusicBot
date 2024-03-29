const { EmbedBuilder } = require("discord.js");


module.exports = {
    name: "bassboost",
    description: "Đặt bộ lọc trình phát hiện tại thành BassBoost.",
    category: "Filters",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const player = client.poru.players.get(interaction.guild.id);

        await player.filters.setBassboost(true);

        const embed = new EmbedBuilder().setDescription(`\<:zcmtyAdmin:1212983944732082246>\ | Bộ lọc: \`BassBoost\``).setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    },
};
