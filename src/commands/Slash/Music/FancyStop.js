const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "stop",
    description: "Stop or disconnect the player.",
    category: "Music",
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
        await interaction.deferReply({ ephemeral: false });

        const Control = await GControl.findOne({ guild: interaction.guild.id });

        // When button control "enable", this will make command unable to use. You can delete this
        if (Control.playerControl === "disable") {
            const ctrl = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`<:icon_cross:1200797307805892651> | You can't use this command as the player control was enable!`);
            return interaction.editReply({ embeds: [ctrl] });
        }

        const player = client.poru.players.get(interaction.guild.id);

        if (player.message) await player.message.delete();

        await player.destroy();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:bye_bye:1200807710858416138>\ | Player has been: \`Disconnected\``);

        return interaction.editReply({ embeds: [embed] });
    },
};
