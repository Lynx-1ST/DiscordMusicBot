const { EmbedBuilder } = require("discord.js");
const Reconnect = require("../../../settings/models/247.js");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "247",
    description: "Bật tắt 24/7 trong kênh thoại.",
    category: "Premium",
    permissions: {
        bot: ["Speak", "Connect"],
        channel: ["Speak", "Connect"],
        user: [],
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
        await interaction.deferReply({ ephemeral: false });

        const player = client.poru.players.get(interaction.guild.id);

        let data = await Reconnect.findOne({ guild: interaction.guild.id });

        if (data) {
            await data.delete();

            const off = new EmbedBuilder().setDescription(`<a:check_mark:1213409895483965490> | Chế độ 24/7 đã: \`TẮT\``).setColor(client.color);

            return interaction.editReply({ embeds: [off] });
        } else if (!data) {
            const user = await User.findOne({ Id: interaction.user.id });

            let expired = user.premium.expiresAt; // this will make the command activated til the user premium expired, Disable this if you set the 247 setting remium to false

            const newData = await Reconnect.create({
                guild: player.guildId,
                text: player.textChannel,
                voice: player.voiceChannel,
                time: expired, // Disable this if you set the 247 premium setting to false
            });

            await newData.save();

            const on = new EmbedBuilder().setDescription(`<a:check_mark:1213409895483965490> | Chế độ 24/7 đã: \`BẬT\``).setColor(client.color);

            return interaction.editReply({ embeds: [on] });
        }
    },
};
