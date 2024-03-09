const { EmbedBuilder } = require("discord.js");
const Ban = require("../../../settings/models/User.js");

module.exports = {
    name: "ban",
    description: "Cấm người dùng sử dụng bot.",
    category: "Developer",
    aliases: ["banuser"],
    owner: true,
    run: async (client, message, args) => {
        let id = args[0];
        let type = args[1];

        if (!id) return message.reply({ content: "✖️ | Cung cấp ID người dùng." });

        let REGEX = new RegExp(/^[0-9]+$/);

        if (!REGEX.test(id)) {
            const embed = new EmbedBuilder().setDescription(`\✖️\ | ID phải là một dãy số.`).setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        if (!type) return message.reply({ content: "\✖️\ | Nhập lệnh. `bật` hoặc `tắt`." });

        let typeMode = ["bật", "tắt"];

        if (!typeMode.includes(type)) return message.reply({ content: "\✖️\ | Nhập lệnh. `bật` hoặc `tắt`." });

        const user = await User.findOne({ Id: id });

        if (!user) {
            const embed = new EmbedBuilder().setDescription(`\✖️\ | \`${id}\` không có trong database.`).setColor(client.color);

            return message.reply({ embeds: [embed] });
        }
        const status = user.status;

        if (type === "enable") {
            if (status.isBanned === true) {
                const embed = new EmbedBuilder().setDescription(`\✖️\ | \`${id}\` đã bị ban rồi.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            } else {
                status.isBanned = true;
                status.bannedBy = message.author.id;
                status.bannedAt = Date.now();

                await user.save();

                const embed = new EmbedBuilder().setDescription(`<a:check_mark:1213409895483965490> | You've successfully banned \`${id}\`.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            }
        } else if (type === "disable") {
            if (status.isBanned === false) {
                const embed = new EmbedBuilder().setDescription(`\✖️\ | \`${id}\` chưa bị ban.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            } else {
                status.isBanned = false;
                status.bannedBy = null;
                status.bannedAt = null;
                await user.save();

                const embed = new EmbedBuilder().setDescription(`<a:check_mark:1213409895483965490> | Gỡ ban thành công \`${id}\`.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            }
        }
    },
};
