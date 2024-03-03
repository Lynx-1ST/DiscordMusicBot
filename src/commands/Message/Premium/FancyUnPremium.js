const { EmbedBuilder } = require("discord.js");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "unpremium",
    description: "Delete user premium.",
    category: "Premium",
    aliases: ["premiumdelete"],
    owner: true,
    run: async (client, message, args) => {
        let id = args[0];

        if (!id) return message.reply({ content: "✖️ | Cung cấp ID người dùng." });

        let REGEX = new RegExp(/^[0-9]+$/);

        if (!REGEX.test(id)) {
            const embed = new EmbedBuilder().setDescription(`✖️ | ID phải là một dãy số.`).setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        const user = client.premium.get(id);

        if (!user) {
            const embed = new EmbedBuilder()
                .setDescription(`\✖️\ | \`${id}\` không có trong database.`)
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        const userData = await User.findOne({ Id: id });

        if (userData.isPremium === true) {
            userData.isPremium = false;
            userData.premium.redeemedBy = [];
            userData.premium.redeemedAt = null;
            userData.premium.expiresAt = null;
            userData.premium.plan = null;

            const newUser = await userData.save();
            client.premium.set(userData.Id, newUser);

            const embed = new EmbedBuilder()
                .setDescription(`\✖️\ | Bạn đã thành công gỡ \`${id}\` khỏi chế độ Premium.`)
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setDescription(`\✖️\ | \`${id}\` người dùng đã bị gỡ hoặc không có Premium.`)
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        }
    },
};
