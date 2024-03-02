const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "generate",
    description: "Tạo mã người dùng cao cấp.",
    category: "Developer",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: false,
        player: false,
        current: false,
        owner: true,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder().setDescription(`Sử dụng +generate để tạo mã cao cấp`).setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    },
};
