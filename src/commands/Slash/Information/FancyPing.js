const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Lấy độ trễ máy chủ <a:loading:1213403030616018944>",
    category: "Information",
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
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder().setDescription(`<a:green:1213401879095152682>  ${client.user.username} Độ trễ mạng!\n<a:green:1213401879095152682> **Độ trễ API:** __${Math.round(client.ws.ping)}ms__\n<a:green:1213401879095152682> **Độ trễ Websocket:** __${Math.round(client.ws.ping)}__`).setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    },
};
