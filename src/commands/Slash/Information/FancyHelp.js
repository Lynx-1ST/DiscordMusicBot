const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { readdirSync } = require("fs");
const { supportUrl, inviteUrl, voteUrl } = require("../../../settings/config.js");

module.exports = {
    name: "help",
    description: "Hiển thị tất cả các lệnh của bot.",
    category: "Information",
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

        const row2 = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setLabel("🤖").setURL('https://github.com/Lynx-1ST').setStyle(ButtonStyle.Link))
            .addComponents(new ButtonBuilder().setLabel("Support 🛡️").setURL(supportUrl).setStyle(ButtonStyle.Link));

        const categories = readdirSync("./src/commands/Slash/");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.guild.members.me.displayName} Bảng Trợ Giúp! 💖`,
                iconURL: "https://cdn.discordapp.com/emojis/1189604441213644851.gif",
            })
            .setColor(client.color)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                `👋🏻  Xin chào **${interaction.member}**, Tôi là **${client.user}** <a:Anime_nekocutenothirstspraywater:1212719299949502514>\n\n<:bot:1213400513597677690> **${client.user.username}**\n** Một MusicBot Discord nâng cao với giao diện thân thiện với người dùng. Tôi hứa với bạn rằng tôi sẽ cố gắng hết sức để mang đến cho bạn những nhịp điệu hay một cách rõ ràng.** \n\n<a:rgb:1213819096710516757><a:rgb:1213819096710516757><a:rgb:1213819096710516757><a:hg_guradanhdan:1213401050925764659> **__DANH MỤC__** <a:hg_guradanhdan:1213401050925764659><a:rgb:1213819096710516757><a:rgb:1213819096710516757><a:rgb:1213819096710516757>\n<:zlogServer:1213005861555933275> ●  **Thông tin**\n<a:music:1213007629379575880> ●  **Âm Nhạc**\n<a:99_yellowcrown:1213402242015699074> ●  **Premium**\n<:zcmtyOwner:1212982871011360768> ●  **Phát triển**\n<:zcmtyAdmin:1212983944732082246> ● **Bộ Lọc**\n\n<a:rgb:1213819096710516757><a:rgb:1213819096710516757><a:rgb:1213819096710516757><:update:1213006164284022795> **__TRẠNG THÁI__:  ${client.user.username}** <:update:1213006164284022795><a:rgb:1213819096710516757><a:rgb:1213819096710516757><a:rgb:1213819096710516757>\n<:zinfoHome:1213008332906958888> ●  Máy chủ: **${client.guilds.cache.size}**\n<a:green:1213401879095152682> ●  Độ trễ: **${Math.round(client.ws.ping)}ms**\n`
            )
            .setFooter({
                text: `Tạo bởi Lynx_1ST 🛡️`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("help-category")
                .setPlaceholder(`Danh sách lệnh`)
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    categories.map((category) => {
                        return new StringSelectMenuOptionBuilder().setLabel(category).setValue(category);
                    })
                ),
        ]);

        interaction.editReply({ embeds: [embed], components: [row, row2] }).then(async (msg) => {
            let filter = (i) => i.isStringSelectMenu() && i.user && i.message.author.id == client.user.id;

            let collector = await msg.createMessageComponentCollector({
                filter,
                time: 100000,
            });

            collector.on("collect", async (m) => {
                if (m.isStringSelectMenu()) {
                    if (m.customId === "help-category") {
                        await m.deferUpdate();

                        let [directory] = m.values;

                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `${interaction.guild.members.me.displayName} lệnh hỗ trợ!`,
                                iconURL: interaction.guild.iconURL({ dynamic: true }),
                            })
                            .setDescription(
                                `\ \n\n**\<a:emoji6592:1213420855300984832> ${
                                    directory.slice(0, 1).toUpperCase() + directory.slice(1)
                                } Commands:**\n${client.slashCommands
                                    .filter((c) => c.category === directory)
                                    .map((c) => `\`${c.name}\` : *${c.description}*`)
                                    .join("\n")}`
                            )
                            .setColor(client.color)
                            .setFooter({
                                text: `Tạo bởi Lynx_1ST 🛡️ | Tổng số lệnh: ${
                                    client.slashCommands.filter((c) => c.category === directory).size
                                }`,
                                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setTimestamp();

                        msg.edit({ embeds: [embed] });
                    }
                }
            });

            collector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    const timed = new EmbedBuilder()
                        .setAuthor({
                            name: `${interaction.guild.members.me.displayName} Bảng Trợ Giúp! 💖`,
                            iconURL: interaction.guild.iconURL({ dynamic: true }),
                        })
                        .setDescription(
                            `Vui lòng sử dụng lại /help để kiểm tra lệnh <a:green:1213401879095152682>`
                        )
                        .setColor(client.color)
                        .setFooter({
                            text: `DMs để trở thành Premium`,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setTimestamp();

                    msg.edit({ embeds: [timed], components: [row2] });
                }
            });
        });
    },
};
