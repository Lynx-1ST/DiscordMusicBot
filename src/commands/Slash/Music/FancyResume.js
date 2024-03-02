const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "resume",
    description: "Resume current paused song.",
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

        if (player.isPaused) {
            await player.pause(false);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Bài hát đã được: \`Tiếp tục\``);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`<a:check_mark:1213409895483965490>\` | Bài hát không được: \`Tạm dừng\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
