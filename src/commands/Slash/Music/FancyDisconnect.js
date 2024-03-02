const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "disconnect",
    description: "Buộc ngắt kết nối bot khỏi kênh thoại của bạn.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: ["ManageGuild"],
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

        const player = client.poru.players.get(interaction.guild.id);

        if (player.message) await player.message.delete();

        await player.destroy();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\ <a:sadcatrunning:1213409603828584523>\ | Trình phát đã: \`Ngắt kết nối\``);

        return interaction.editReply({ embeds: [embed] });
    },
};
