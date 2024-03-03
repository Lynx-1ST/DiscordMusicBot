const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "profile",
    description: "Hiển thị thông tin trạng thái cao cấp của bạn.",
    category: "Premium",
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

        const user = await User.findOne({ Id: interaction.user.id });
        const timeLeft = moment(user.premium.expiresAt).format("dddd, MMMM Do YYYY HH:mm:ss");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.tag} Chi tiết Premium`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setColor(client.color)
            .setDescription(`<a:99_yellowcrown:1213402242015699074> Dưới đây là thông tin chi tiết về trạng thái cao cấp của bạn.`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: "Premium" })
            .setTimestamp();

        if (user.premium.plan === "lifetime") {
            embed.addFields([
                { name: `<a:99_yellowcrown:1213402242015699074> | Plan:`, value: `\`\`\`${toOppositeCase(user.premium.plan)}\`\`\``, inline: true },
                { name:
`<a:99_yellowcrown:1213402242015699074> | Tính năng:`, value: `\`\`\`Premium\`\`\``, inline: true },
                { name: `<a:99_yellowcrown:1213402242015699074> | Hết hạn:`, value: `\`\`\`Không bao giờ\`\`\``, inline: false },    
            ]);
        } else {
            embed.addFields([
                { name: `<a:99_yellowcrown:1213402242015699074> | Plan:`, value: `\`\`\`${toOppositeCase(user.premium.plan || "Free")}\`\`\``, inline: true },
            ]);

            if (user.premium.expiresAt < Date.now()) {
                embed.addFields([
                    { name: `<a:99_yellowcrown:1213402242015699074> | Tính năng:`, value: `\`\`\`KHOÁ\`\`\``, inline: true },
                    { name: `<a:99_yellowcrown:1213402242015699074> | Hết hạn:`, value: `\`\`\`Không bao giờ\`\`\``, inline: false },
                ]);
            } else {
                embed.addFields([
                    { name: `<a:99_yellowcrown:1213402242015699074> | Tính năng:`, value: `\`\`\`Premium\`\`\``, inline: true },
                    { name: `<a:99_yellowcrown:1213402242015699074> | Hết hạn:`, value: `\`\`\`${timeLeft}\`\`\``, inline: false },
                ]);
            }
        }

        return interaction.editReply({ embeds: [embed] });
    },
};

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}
