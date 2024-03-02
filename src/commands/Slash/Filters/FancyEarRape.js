const { EmbedBuilder } = require("discord.js");


module.exports = {
    name: "earrape",
    description: "Đặt bộ lọc trình phát hiện tại thành EarRape.",
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

        await player.setVolume(500);

        const embed = new EmbedBuilder().setDescription(`\<:zcmtyAdmin:1212983944732082246>\ | Bộ lọc: \`EarRape\``).setColor(client.color);

     
        return interaction.editReply({ embeds: [embed] });
    },
};
