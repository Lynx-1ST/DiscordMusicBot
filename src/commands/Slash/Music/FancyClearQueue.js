const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clearqueue",
    description: "Clear the current player queue.",
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
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\ <:icon_cross:1200797307805892651>\ | Queue is: \`Empty\``);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const { length } = player.queue;

            await player.queue.clear();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`<:Check:1200809259928129547> | \`${length}\` Queue has been: \`Cleared\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
