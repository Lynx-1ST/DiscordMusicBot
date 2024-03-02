const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "pause",
    description: "Tạm dừng bài hát đang phát.",
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
        await interaction.deferReply({ ephemeral: true });

        const Control = await GControl.findOne({ guild: interaction.guild.id });

        // When button control "enable", this will make command unable to use. You can delete this
        if (Control.playerControl === "enable") {
            const ctrl = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\✖️\ | Bạn không thể sử dụng lệnh này vì điều khiển trình phát đã được bật!`);
            return interaction.editReply({ embeds: [ctrl] });
        }

        const player = client.poru.players.get(interaction.guild.id);

        if (!player.isPaused) {
            await player.pause(true);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Bài hát đã được \`TẠM DỪNG\``);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<:icon_cross:1200797307805892651>\ | Bài hát đang \`TẠM DỪNG\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
