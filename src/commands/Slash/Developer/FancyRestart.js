const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "restart",
    description: "Restart The System.",
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
    run: async (client, message) => {
        const embed = new EmbedBuilder().setDescription(`<a:Bot:1200818564198846594> | Bot is: \`Restarting\``).setColor(client.color);

        await message.reply({ embeds: [embed] });

        process.exit();
    },
};
