const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports.run = async (client, guild) => {
    const channel = client.channels.cache.get(client.config.guildLogs);

    let own = await guild.fetchOwner();

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Đã thoát máy chủ!`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields([
            { name: "Tên", value: `\`\`\`${guild.name}\`\`\``, inline: true },
            { name: "ID", value: `\`\`\`${guild.id}\`\`\``, inline: true },
            { name: "Số thành viên", value: `\`\`\`${guild.memberCount} người dùng\`\`\``, inline: true },
            {
                name: "Chủ sở hữu",
                value: `\`\`\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} | ${
                    own.id
                }\`\`\``,
            },
            { name: "Ngày tạo", value: `\`\`\`${moment.utc(guild.createdAt).format("DD/MMM/YYYY")}\`\`\`` },
            { name: `Số máy chủ của ${client.user.username}`, value: `\`\`\`${client.guilds.cache.size} Máy chủ\`\`\`` },
        ])
        .setColor(client.color)
        .setTimestamp();

    if (guild.iconURL()) {
        embed.setThumbnail(guild.iconURL({ size: 2048 }));
    } else {
        embed.setThumbnail(client.user.displayAvatarURL({ size: 2048 }));
    }

    if (guild.bannerURL()) {
        embed.setImage(guild.bannerURL());
    } else {
        embed.setImage(client.config.bannerUrl);
    }

    channel.send({ embeds: [embed] });
};
