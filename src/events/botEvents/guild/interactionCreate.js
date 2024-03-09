const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionType } = require("discord.js");
const { voteUrl } = require("../../../settings/config.js");
const Ban = require("../../../settings/models/User.js");

module.exports.run = async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.slashCommands.get(interaction.commandName);

        // GETTING PREMIUM USER DATABASE
        let user = client.premium.get(interaction.user.id);
        await client.createInteraction(interaction);

        if (!command) return;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Support 🛡️").setURL(voteUrl).setStyle(ButtonStyle.Link),
        );

        if (client.dev.has(true) && interaction.user.id !== client.owner) {
            return interaction.reply({
                content: `👋🏻 Xin chào người dùng\n**${client.user} hiện đang được bảo trì**`,
                components: [row],
                ephemeral: true,
            });
        }

        const msg_cmd = [
            `[SLASH] ${command.name}`,
            `used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`,
        ];

        console.log(`${msg_cmd.join(" ")}`);

        const userBan = await User.findOne({ Id: interaction.user.id });
        const statusBan = userBan.status;

        if (userBan && statusBan.isBanned === true && interaction.user.id !== client.owner) {
            return interaction.reply({
                content: `✖️  | Bạn bị cấm sử dụng ${client.user}, hãy nhấp vào nút hỗ trợ để khiếu nại.`,
                components: [row],
                ephemeral: true,
            });
        }

        // DEFAULT PERMISSIONS
        const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
        const botMissingPermissions = [];

        for (const perm of botPermissions) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) {
                botMissingPermissions.push(perm);
            }
        }

        if (botMissingPermissions.length > 0) {
            return interaction.reply({
                content: `✖️  | Tôi không có một trong các quyền này \`ViewChannel\`, \`SendMessages\`, \`EmbedLinks\`.\nVui lòng kiểm tra kỹ chúng trong cài đặt kênh và vai trò máy chủ của bạn.`,
                components: [row],
                ephemeral: true,
            });
        }

        const warning = new EmbedBuilder().setColor(client.color);

        // CHECK BOT COMMANDS PERMISSIONS
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(command.permissions.bot || [])) {
            warning.setDescription(`🔶 | Tôi không có quyền \`${command.permissions.bot.join(", ")}\` để thực thi lệnh này.`);

            return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
        }

        // CHECK USER PERMISSIONS
        if (!interaction.member.permissions.has(command.permissions.user || [])) {
            warning.setDescription(
                `✖️  | Bạn không có quyền \`${command.permissions.user.join(", ")}\` để thực thi lệnh này.`,
            );

            return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
        }

        // CHECK PLAYER & CURRENT PLAYING
        let player = client.poru.players.get(interaction.guild.id);
        //Player check
        if (command.settings.player && !player) {
            warning.setDescription(`✖️ | Không có trình phát nào khả dụng cho máy chủ này.`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        // CURRENT PLAYING CHECK
        if (command.settings.current && !player.currentTrack) {
            warning.setDescription(`✖️ | Không có bất kỳ bài hát hiện tại nào.`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        // CHECK IN VOICE & SAME VOICE CHANNEL
        const { channel } = interaction.member.voice;
        //In Voice Channel Check
        if (command.settings.inVc) {
            if (!channel) {
                warning.setDescription(`✖️ | Bạn phải ở trong kênh thoại để sử dụng lệnh này.`);

                return interaction.reply({ embeds: [warning], ephemeral: true });
            }

            // BOT IN CHANNEL CHECK
            if (
                !interaction.guild.members.cache
                    .get(client.user.id)
                    .permissionsIn(channel)
                    .has(command.permissions.channel || [])
            ) {
                warning.setDescription(
                    `✖️ | Tôi không có quyền \`${command.permissions.channel.join(
                        ", ",
                    )}\` để thực hiện lệnh này trong kênh.`,
                );

                return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
            }
        }

        // SAME VOICE CHANNEL CHECK
        if (command.settings.sameVc) {
            if (!channel || interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
                warning.setDescription(`✖️ | Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này.`);

                return interaction.reply({ embeds: [warning], ephemeral: true });
            }

            // BOT IN CHANNEL CHECK
            if (
                !interaction.guild.members.cache
                    .get(client.user.id)
                    .permissionsIn(channel)
                    .has(command.permissions.channel || [])
            ) {
                warning.setDescription(
                    `✖️ | Tôi không có quyền \`${command.permissions.channel.join(
                        ", ",
                    )}\` để thực hiện lệnh này trong kênh.`,
                );

                return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
            }
        }

        // PREMIUM USER CHECK
        if (command.settings.premium) {
            if (user && !user.isPremium) {
                warning.setDescription(`😢 | Bạn không phải là người dùng cao cấp!`);

                return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
            }
        }

        // CHECK OWNER
        if (command.settings.owner && interaction.user.id !== client.owner) {
            warning.setDescription(`😢 | Chỉ chủ sở hữu của tôi mới có thể sử dụng lệnh này!\n\nPremium`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        // ERORR HANDLING
        try {
            command.run(client, interaction);
        } catch (error) {
            console.log(error);

            warning.setDescription(`✖️ | Đã xảy ra lỗi.`);

            return interaction.editReply({ embeds: [warning], components: [row], ephmeral: true });
        }
    }
};
