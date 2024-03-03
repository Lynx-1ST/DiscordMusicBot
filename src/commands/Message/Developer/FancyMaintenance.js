const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "maintenance",
    description: "Chế độ bảo trì.",
    category: "Phát triển",
    aliases: ["maintenance", "mt"],
    owner: true,
    run: async (client, message, args) => {
        const value = args[0];
        const mode = ["bật", "tắt"];

        if (!value) return message.reply({ content: `✖️  | Chưa cung cấp chế độ bảo trì: \`${mode.join(", ")}\`` });

        if (!mode.includes(args[0]))
            return message.reply({ content: `✖️  | Chưa cung cấp chế độ bảo trì: \`${mode.join(", ")}\`` });

        const enable = true;

        const embed = new EmbedBuilder().setColor(client.color).setTimestamp();

        if (value === "enable") {
            if (client.dev.has(enable)) {
                embed.setDescription(`✖️  | Chế độ bảo trì đã: \`Bật\``);

                return message.reply({ embeds: [embed] });
            }

            await client.dev.add(enable);

            embed.setDescription(`<a:check_mark:1213409895483965490> | Chế độ bảo trì: \`Bật\``);

            return message.reply({ embeds: [embed] });
        }

        if (value === "disable") {
            if (!client.dev.has(enable)) {
                embed.setDescription(`✖️  | Chế độ bảo trì đã: \`Disabled\``);

                return message.reply({ embeds: [embed] });
            }

            await client.dev.delete(enable);

            embed.setDescription(`<a:check_mark:1213409895483965490> | Chế độ bảo trì: \`Tắt\``);

            return message.reply({ embeds: [embed] });
        }
    },
};
