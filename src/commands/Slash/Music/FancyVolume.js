const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "volume",
    description: "Đặt âm lượng của trình phát hiện tại.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "Số lượng âm lượng bạn muốn đặt.",
            type: ApplicationCommandOptionType.Number,
            required: false,
            min_value: 1,
            max_value: 150,
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

        const Control = await GControl.findOne({ guild: interaction.guild.id });

        // When button control "enable", this will make command unable to use. You can delete this
        if (Control.playerControl === "enable") {
            const ctrl = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\\✖️\ | Bạn không thể sử dụng lệnh này vì điều khiển trình phát đã được bật!`);
            return interaction.editReply({ embeds: [ctrl] });
        }

        const player = client.poru.players.get(interaction.guild.id);
        const value = interaction.options.getNumber("amount");

        if (!value) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\🔊\ | Âm lượng: \`${player.volume}%\``);

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await player.setVolume(value);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\🔊\ | Âm lượng: \`${value}%\``);

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};
