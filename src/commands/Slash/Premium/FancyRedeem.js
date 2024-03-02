const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const moment = require("moment");
const Code = require("../../../settings/models/Code.js");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "redeem",
    description: "Redeem your premium code.",
    category: "Premium",
    options: [
        {
            name: "code",
            description: "Provide valid code.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
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

        const input = interaction.options.getString("code");
        const user = await User.findOne({ Id: interaction.user.id });
        const code = await Code.findOne({ code: input.toUpperCase() });

        if (user && user.isPremium) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Bạn đã là người dùng cao cấp.`);

            return interaction.editReply({ embeds: [embed] });
        }

        if (code) {
            if (code.plan === "minutely") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 300000;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.delete();
            }

            if (code.plan === "daily") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.delete();
            }

            if (code.plan === "weekly") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 7;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.delete();
            }

            if (code.plan === "monthly") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 30;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.delete();
            }

            if (code.plan === "yearly") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 365;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.delete();
            }

            if (code.plan === "lifetime") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 365 * 100;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.delete();
            }

            const expires = moment(user.premium.expiresAt).format("dddd, MMMM Do YYYY HH:mm:ss");

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Đã nhận Premium!`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`Chúc mừng <a:99_yellowcrown:1213402242015699074> ${interaction.member}. Bạn đã đổi thành công mã cao cấp với các chi tiết sau.`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setColor(client.color)
                .setTimestamp();

            if (user.premium.plan === "lifetime") {
                embed.addFields([
                    { name: `<a:99_yellowcrown:1213402242015699074> | Nhận bởi`, value: `\`\`\`${interaction.member.displayName}\`\`\``, inline: true },
                    { name: `🔶 | Plan`, value: `\`\`\`${user.premium.plan}\`\`\``, inline: true },
                    { name: `🔶 | Hết hạn`, value: `\`\`\`Never\`\`\``, inline: false },
                ]);
            } else {
                embed.addFields([
                    { name: `<a:99_yellowcrown:1213402242015699074> | Redeemed By`, value: `\`\`\`${interaction.member.displayName}\`\`\``, inline: true },
                    { name: `🔶 | Plan`, value: `\`\`\`${user.premium.plan}\`\`\``, inline: true },
                    { name: `🔶 | Hết hạn`, value: `\`\`\`${expires}\`\`\``, inline: false },
                ]);
            }

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | Mã được cung cấp không hợp lệ, vui lòng sử dụng mã hợp lệ.`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
