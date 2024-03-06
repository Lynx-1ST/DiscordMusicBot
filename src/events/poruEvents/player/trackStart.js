const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");
const GControl = require("../../../settings/models/Control.js");
const capital = require("node-capitalize");

module.exports.run = async (client, player, track) => {
    let Control = await GControl.findOne({ guild: player.guildId });
    if (!Control) {
        Control = await GControl.create({ guild: player.guildId, playerControl: "enable" });
    }

    if (!player) return;

    const titles = track.info.title.length > 20 ? track.info.title.substr(0, 20) + "..." : track.info.title;
    const authors = track.info.author.length > 20 ? track.info.author.substr(0, 20) + "..." : track.info.author;
    const trackDuration = track.info.isStream ? "LIVE" : formatDuration(track.info.length);
    const trackAuthor = track.info.author ? authors : "Unknown";
    const trackTitle = track.info.title ? titles : "Unknown";

    const Started = new EmbedBuilder()
        .setAuthor({
            name: `—— ĐANG PHÁT ——`,
            iconURL: "https://cdn.discordapp.com/emojis/1189604441213644851.gif",
        })
        .setDescription(`<a:load:1213818804610531408> **[${trackTitle}](${track.info.uri})** <a:load:1213818804610531408>`)
        .setThumbnail(client.user.displayAvatarURL())
        .setImage(track.info.image)
        .addFields([
            { name: `Tác giả:`, value: `${trackAuthor}`, inline: true },
            { name: `Yêu cầu:`, value: `${track.info.requester}`, inline: true },
            { name: `Thời lượng:`, value: `${trackDuration}`, inline: true },
        ])
        .setColor(client.color)
        .setFooter({ text: `Chế độ Lặp lại: ${capital(player.loop)} • Hàng chờ còn lại: ${player.queue.length} • Âm lượng: ${player.volume}%` });

    const emoji = client.emoji.button;
    const buttons = [
        { customId: "replay", emoji: emoji.replay, style: ButtonStyle.Secondary },
        { customId: "prev", emoji: emoji.previous, style: ButtonStyle.Secondary },
        { customId: "pause", emoji: emoji.pause, style: ButtonStyle.Secondary },
        { customId: "skip", emoji: emoji.skip, style: ButtonStyle.Secondary },
        { customId: "loop", emoji: emoji.loop.none, style: ButtonStyle.Secondary },
        { customId: "shuffle", emoji: emoji.shuffle, style: ButtonStyle.Secondary },
        { customId: "voldown", emoji: emoji.voldown, style: ButtonStyle.Secondary },
        { customId: "stop", emoji: emoji.stop, style: ButtonStyle.Danger },
        { customId: "volup", emoji: emoji.volup, style: ButtonStyle.Secondary },
        { customId: "info", emoji: emoji.info, style: ButtonStyle.Secondary }
    ];

    const buttonRows = buttons.map(btn => new ButtonBuilder().setCustomId(btn.customId).setEmoji(btn.emoji).setStyle(btn.style));
    const actionRow1 = new ActionRowBuilder().addComponents(buttonRows.slice(0, 5));
    const actionRow2 = new ActionRowBuilder().addComponents(buttonRows.slice(5));

    if (Control.playerControl === "disable") {
        return client.channels.cache.get(player.textChannel).send({ embeds: [Started] }).then(x => (player.message = x));
    }

    const nplaying = await client.channels.cache.get(player.textChannel).send({ embeds: [Started], components: [actionRow1, actionRow2] }).then(x => (player.message = x));

    const filter = (message) => {
        if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) {
            return true;
        } else {
            message.reply({
                content: `\`❌\` | Bạn phải ở cùng kênh thoại với tôi để sử dụng nút này.`,
                ephemeral: true,
            });
        }
    };

    const collector = nplaying.createMessageComponentCollector({ filter, time: track.info.length });
        // Xử lý các sự kiện khi nhấn vào các nút ở đây
    collector.on("collect", async (message) => {
        if (message.customId === "loop") {
            if (!player) {
                collector.stop();
            } else if (player.loop === "NONE") {
                message.deferUpdate();

                player.setLoop("TRACK");

                Started.setFooter({
                    text: `Chế độ Lặp lại: ${capital(player.loop)} • Hàng chờ còn lại: ${player.queue.length} • Âm lượng: ${player.volume}%`,
                });

                bLoop.setEmoji(emoji.loop.track).setStyle(ButtonStyle.Primary);

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            } else if (player.loop === "TRACK") {
                message.deferUpdate();

                player.setLoop("QUEUE");

                Started.setFooter({
                    text: `Chế độ Lặp lại: ${capital(player.loop)} • Hàng chờ còn lại: ${player.queue.length} • Âm lượng: ${player.volume}%`,
                });

                bLoop.setEmoji(emoji.loop.queue).setStyle(ButtonStyle.Success);

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            } else if (player.loop === "QUEUE") {
                message.deferUpdate();

                player.setLoop("NONE");

                Started.setFooter({
                    text: `Chế độ Lặp lại: ${capital(player.loop)} • Hàng chờ còn lại: ${player.queue.length} • Âm lượng: ${player.volume}%`,
                });

                bLoop.setEmoji(emoji.loop.none).setStyle(ButtonStyle.Secondary);

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            }
        } else if (message.customId === "replay") {
            if (!player) {
                collector.stop();
            } else if (!player.currentTrack.info.isSeekable) {
                const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Bài hát không thể phát lại`);

                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                message.deferUpdate();

                await player.seekTo(0);
            }
        } else if (message.customId === "stop") {
            if (!player) {
                collector.stop();
            } else {
                message.deferUpdate();

                if (player.message) await player.message.delete();

                await player.destroy();
            }
        } else if (message.customId === "pause") {
            if (!player) {
                collector.stop();
            } else if (player.isPaused) {
                message.deferUpdate();

                player.pause(false);

                Started.setAuthor({
                    name: `ĐANG PHÁT`,
                    iconURL: "https://cdn.discordapp.com/emojis/1189604441213644851.gif",
                });

                bPause.setEmoji(emoji.pause).setStyle(ButtonStyle.Secondary);

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            } else {
                message.deferUpdate();

                player.pause(true);

                Started.setAuthor({
                    name: `Bài hát TẠM DỪNG`,
                    iconURL: "https://cdn.discordapp.com/emojis/1189604441213644851.gif",
                });

                bPause.setEmoji(emoji.resume).setStyle(ButtonStyle.Primary);

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            }
        } else if (message.customId === "skip") {
            if (!player) {
                collector.stop();
            } else if (!player || player.queue.size == 0) {
                const embed = new EmbedBuilder().setDescription(`\`❌\` | Hàng đợi là: \`Trống\``).setColor(client.color);

                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                message.deferUpdate();

                await player.stop();
            }
        } else if (message.customId === "prev") {
            if (!player) {
                collector.stop();
            } else if (!player.previousTrack) {
                const embed = new EmbedBuilder().setDescription(`\`❌\` | Bài hát trước đó: \`Không tìm thấy\``).setColor(client.color);

                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                message.deferUpdate();

                await player.queue.unshift(player.previousTrack);
                await player.stop();
            }
        } else if (message.customId === "shuffle") {
            if (!player) {
                collector.stop();
            } else if (!player.queue.length) {
                const embed = new EmbedBuilder().setDescription(`\`❌\` | Hàng đợi là: \`Trống\``).setColor(client.color);

                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                message.deferUpdate();

                await player.queue.shuffle();
            }
        } else if (message.customId === "voldown") {
            if (!player) {
                collector.stop();
            } else if (player.volume < 20) {
                await player.setVolume(10);

                const embed = new EmbedBuilder().setDescription(`\`❌\` | Âm lượng không thể thấp hơn: \`10%\``).setColor(client.color);

                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                message.deferUpdate();

                await player.setVolume(player.volume - 10);

                Started.setFooter({
                    text: `Chế độ Lặp lại: ${capital(player.loop)} • Hàng chờ còn lại: ${player.queue.length} • Âm lượng: ${player.volume}%`,
                });

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            }
        } else if (message.customId === "volup") {
            if (!player) {
                collector.stop();
            } else if (player.volume > 90) {
                await player.setVolume(100);

                const embed = new EmbedBuilder().setDescription(`\`❌\` | Âm lượng không thể cao hơn: \`100%\``).setColor(client.color);

                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                message.deferUpdate();

                await player.setVolume(player.volume + 10);

                Started.setFooter({
                    text: `Hàng đợi còn lại: ${player.queue.length} • Chế độ lặp lại: ${capital(player.loop)} • Âm lượng: ${player.volume}%`,
                });

                await nplaying.edit({ embeds: [Started], components: [button, button2] });
            }
        } else if (message.customId === "info") {
            if (!player) {
                collector.stop();
            } else {
                const sources = capital(player.currentTrack.info.sourceName);
                const Titles =
                    player.currentTrack.info.title.length > 20
                        ? player.currentTrack.info.title.substr(0, 20) + "..."
                        : player.currentTrack.info.title;
                const Author =
                    player.currentTrack.info.author.length > 20
                        ? player.currentTrack.info.author.substr(0, 20) + "..."
                        : player.currentTrack.info.author;
                const currentPosition = formatDuration(player.position);
                const trackDuration = formatDuration(player.currentTrack.info.length);
                const playerDuration = player.currentTrack.info.isStream ? "LIVE" : trackDuration;
                const currentAuthor = player.currentTrack.info.author ? Author : "Unknown";
                const currentTitle = player.currentTrack.info.title ? Titles : "Unknown";
                const Part = Math.floor((player.position / playerDuration) * 30);
                const Emoji = player.isPlaying ? "🕒 |" : "⏸ |";

                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: player.isPlaying ? `ĐANG PHÁT` : `TẠM DỪNG`,
                        iconURL: "https://cdn.discordapp.com/emojis/1189604441213644851.gif",
                    })
                    .setThumbnail(player.currentTrack.info.image)
                    .setDescription(`**[${currentTitle}](${player.currentTrack.info.uri})**`)
                    .addFields([
                        { name: `Tác giả:`, value: `${currentAuthor}`, inline: true },
                        { name: `Yêu cầu:`, value: `${player.currentTrack.info.requester}`, inline: true },
                        { name: `Nguồn:`, value: `${sources}`, inline: true },
                        { name: `Thời lượng:`, value: `${playerDuration}`, inline: true },
                        { name: `Âm lượng:`, value: `${player.volume}%`, inline: true },
                        { name: `Hàng chờ còn lại:`, value: `${player.queue.length}`, inline: true },
                        {
                            name: `Tiến trình bài hát \`[${currentPosition}]\``,
                            value: `\`\`\`${Emoji} ${"─".repeat(Part) + "🔵" + "─".repeat(30 - Part)}\`\`\``,
                            inline: false,
                        },
                    ])
                    .setColor(client.color)
                    .setFooter({ text: `Tạo bởi: Lynx_1ST 🛡️` })
                    .setTimestamp();

                return message.reply({ embeds: [embed], ephemeral: true });
            }
        }
    });
};
