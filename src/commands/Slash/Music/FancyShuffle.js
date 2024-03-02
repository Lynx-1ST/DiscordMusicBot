const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "shuffle",
    description: "Xáo trộn hàng đợi người chơi hiện tại.",
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
        current: false,
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

        if (!player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\✖️\ | Hàng đợi: \`Trống\``);

            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.queue.shuffle();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔀\` | Hàng đợi đã bị: \`Đã xáo trộn\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
