const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "control",
    description: "Hiển thị hoặc ẩn nút điều khiển trình phát.",
    category: "Premium",
    options: [
        {
            name: "mode",
            description: "Chọn hiển thị hoặc ẩn",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Hiển thị",
                    value: "display",
                },
                {
                    name: "Ẩn",
                    value: "hide",
                },
            ],
        },
    ],
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
        premium: true,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const Control = await GControl.findOne({ guild: interaction.guild.id });
        const choice = interaction.options.getString("mode");

        if (choice === "display") {
            if (!Control) {
                const Control = new GControl({ guild: interaction.guild.id, playerControl: "enable" });

                Control.save()
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setDescription(`<a:check_mark:1213409895483965490> | Điều khiển đã được đặt thành: \`BẬT\``)
                            .setColor(client.color);

                        interaction.editReply({ embeds: [embed] });
                    })
                    .catch((err) => {
                        interaction.editReply(`Đã xảy ra lỗi khi cài đặt chế độ điều khiển trình phát!`);
                        console.log(err);
                    });
            } else if (Control) {
                Control.playerControl = "enable";

                Control.save()
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setDescription(`<a:check_mark:1213409895483965490> | Điều khiển đã được đặt thành: \`BẬT\``)
                            .setColor(client.color);

                        interaction.editReply({ embeds: [embed] });
                    })
                    .catch((err) => {
                        interaction.editReply(`Đã xảy ra lỗi khi cài đặt chế độ điều khiển trình phát!`);
                        console.log(err);
                    });
            }
        } else if (choice === "hide") {
            if (!Control) {
                const Control = new GControl({ guild: interaction.guild.id, playerControl: "disable" });

                Control.save()
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setDescription(`<a:check_mark:1213409895483965490> | Điều khiển đã được đặt thành: \`TẮT\``)
                            .setColor(client.color);

                        interaction.editReply({ embeds: [embed] });
                    })
                    .catch((err) => {
                        interaction.editReply(`Đã xảy ra lỗi khi cài đặt chế độ điều khiển trình phát!`);
                        console.log(err);
                    });
            } else if (Control) {
                Control.playerControl = "disable";

                Control.save()
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setDescription(`<a:check_mark:1213409895483965490> | Điều khiển đã được đặt thành: \`TẮT\``)
                            .setColor(client.color);

                        interaction.editReply({ embeds: [embed] });
                    })
                    .catch((err) => {
                        interaction.editReply(`Đã xảy ra lỗi khi cài đặt chế độ điều khiển trình phát!`);
                        console.log(err);
                    });
            }
        }
    },
};
