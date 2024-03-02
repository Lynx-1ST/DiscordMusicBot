const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clearqueue",
    description: "Xóa hàng đợi trình phát hiện tại.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const player = client.poru.players.get(interaction.guild.id);

        if (!player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<:pnv_chamxanhbien:1213408989086359654>\ | Hàng đợi: \`Trống\``);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const { length } = player.queue;

            await player.queue.clear();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`<a:loading:1213403030616018944> | \`${length}\` Hàng đợi: \`Đã xóa\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
