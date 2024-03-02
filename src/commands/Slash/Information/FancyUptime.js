const { EmbedBuilder } = require("discord.js");
const os = require("os");
const pretty = require('pretty-ms');

module.exports = {
    name: "uptime",
    description: "Trả về thông tin về thời gian hoạt động của bot",
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
    let uptime = await os.uptime();

        let d = Math.floor(uptime / (3600 * 24));
        let h = Math.floor((uptime % (3600 * 24)) / 3600);
        let m = Math.floor((uptime % 3600) / 60);
        let s = Math.floor(uptime % 60);
        let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
        let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
        let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
        let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
      await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder()
            .setTitle(`<a:disk:1200807327616479364> Uptime Information!`)
            .setDescription(`\`\`\`yml\n❓ Trạng thái : Online\n⏲ Uptime : ${pretty(client.uptime)}\n✈️ Uptime hệ thống : ${dDisplay + hDisplay + mDisplay + sDisplay}\n\`\`\``)
            .setColor(client.color);

        interaction.followUp({ embeds: [embed] });
    },
};
