const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { supportUrl, leaveTimeout } = require("../../../settings/config.js");
const Reconnect = require("../../../settings/models/247.js");

module.exports.run = async (client, oldState, newState) => {
    const player = client.poru.players.get(newState.guild.id);
    if (!player) return;

    if (!newState.guild.members.cache.get(client.user.id).voice.channelId) player.destroy();

    if (newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.members.me.voice.suppress) {
        if (
            newState.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect) ||
            (newState.channel && newState.channel.permissionsFor(nS.guild.members.me).has(PermissionsBitField.Flags.Speak))
        ) {
            newState.guild.members.me.voice.setSuppressed(false);
        }
    }

    if (oldState.id === client.user.id) return;
    if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

    let data = await Reconnect.findOne({ guild: newState.guild.id });

    if (!data) data = await Reconnect.findOne({ guild: oldState.guild.id });
    // THIS WILL MAKE THE BOT WILL NOT BE DISCONNECT/DESTROYED WHEN LEFTED ALONE IN CHANNEL IF 247 ACTIVATED
    if (data && Date.now() >= data.time) {
        await data.delete();

        console.log(`[INFO] 247 has been disabled from (${newState.guild.id || oldState.guild.id})`);
    } // // DISABLE THIS "if" WHEN 247 COMMANDS SETTINGS PREMIUM IS SET TO "false"

    if (data) return;
    //

    const vcRoom = oldState.guild.members.me.voice.channel.id;
    const leaveEmbed = client.channels.cache.get(player.textChannel);

    if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
        if (
            oldState.guild.members.me.voice?.channel &&
            oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0
        ) {
            await delay(leaveTimeout);

            const vcMembers = oldState.guild.members.me.voice.channel?.members.size;

            if (!vcMembers || vcMembers === 1) {
                const newPlayer = client.poru.players.get(newState.guild.id);

                newPlayer ? await player.destroy() : oldState.guild.members.me.voice.channel.leave();

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setLabel("Support 🛡️").setURL(supportUrl).setStyle(ButtonStyle.Link),
                );

                const TimeoutEmbed = new EmbedBuilder()
                    .setDescription(
                        `\`<a:sadcatrunning:1213409603828584523>\` | Đã ngắt kết nối...!!! Bởi vì tôi bị bỏ lại một mình trong <#${vcRoom}>. Bạn có thể tắt tính năng này bằng cách sử dụng lệnh \`247\`.`,
                    )
                    .setColor(client.color);

                try {
                    if (leaveEmbed) leaveEmbed.send({ embeds: [TimeoutEmbed], components: [row] });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
};

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
