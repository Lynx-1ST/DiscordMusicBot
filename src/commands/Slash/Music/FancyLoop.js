const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");

module.exports = {
    name: "loop",
    description: "Mời bot vào kênh thoại của bạn.",
    category: "Music",
    options: [
        {
            name: "chế độ",
            description: "Chọn chế độ vòng lặp cho trình phát hiện tại.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Bài hát hiện tại",
                    value: "current",
                },
                {
                    name: "Hàng đợi",
                    value: "queue",
                },
            ],
        },
    ],
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const Control = await GControl.findOne({ guild: interaction.guild.id });



        const player = client.poru.players.get(interaction.guild.id);
        const input = interaction.options.getString("mode");

        if (input === "current") {
            if (player.loop === "TRACK") {
                await player.setLoop("NONE");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Chế độ vòng lặp là: \`TẮT\``);

                return interaction.editReply({ embeds: [embed] });
            } else {
                await player.setLoop("TRACK");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Chế độ vòng lặp là: \`Bài hát hiện tại\``);

                return interaction.editReply({ embeds: [embed] });
            }
        } else if (input === "queue") {
            if (player.loop === "QUEUE") {
                await player.setLoop("NONE");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Chế độ vòng lặp là: \`TẮT\``);

                return interaction.editReply({ embeds: [embed] });
            } else {
                player.setLoop("QUEUE");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`\<a:check_mark:1213409895483965490>\ | Chế độ vòng lặp là: \`Hàng đợi\``);

                return interaction.editReply({ embeds: [embed] });
            }
        }

    },
};
