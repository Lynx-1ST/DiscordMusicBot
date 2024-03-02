const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "nightcore",
    description: "Set the current player filter to Nightcore.",
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

        await player.filters.setNightcore(true);

        const embed = new EmbedBuilder().setDescription(`\<:zcmtyAdmin:1212983944732082246>\ | Bộ lọc: \`Nightcore\``).setColor(client.color);


        return interaction.editReply({ embeds: [embed] });
    },
};
