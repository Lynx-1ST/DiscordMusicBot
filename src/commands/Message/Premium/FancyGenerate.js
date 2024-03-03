const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const voucher_codes = require("voucher-code-generator");
const Code = require("../../../settings/models/Code.js");

module.exports = {
    name: "generate",
    description: "Generate premium user code.",
    category: "Premium",
    aliases: ["premiumcode", "generate"],
    owner: true,
    run: async (client, message, args) => {
        let codes = [];

        const plan = args[0];
        const plans = ["minutely", "daily", "weekly", "monthly", "yearly", "lifetime"];

        if (!plan) return message.reply({ content: `\✖️\ | You didn't provide any type of plans: \`${plans.join(", ")}\`` });

        if (!plans.includes(plan))
            return message.reply({ content: `\✖️\ | You didn't provide any valid type of plans: \`${plans.join(", ")}\`` });

        let amount = args[1];

        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
            const codePremium = voucher_codes.generate({ pattern: "####-####-####" });

            const code = codePremium.toString().toUpperCase();
            const findCode = await Code.findOne({ code: code });

            if (!findCode) {
                Code.create({ code: code, plan: plan });

                codes.push(`${i + 1} - ${code}`);
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username} Mã kích hoạt Premium`, iconURL: client.user.avatarURL() })
            .setDescription(`🎉 Đã tạo code Premium:\n\n--------\n${codes.join("\n")}\n--------`)
            .addFields([
                { name: `Tổng cộng:`, value: `\`\`\`+${codes.length}\`\`\``, inline: true },
                { name: `Plan:`, value: `\`\`\`${plan}\`\`\``, inline: true },
            ])
            .setColor(client.color)
            .setFooter({ text: `Tạo bởi ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },
};
