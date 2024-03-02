const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { voteUrl } = require("../../../settings/config.js");

module.exports.run = async (client, message) => {
    //IGNORING BOT,SYSTEM, DM AND WEBHOOK MESSAGES
    if (message.author.bot || !message.guild || message.system || message.webhookId) return;

    await client.createMessage(message);

    let prefix = client.prefix;
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
        const embed = new EmbedBuilder().setColor(client.color).setDescription(`<:Wave:1200807208733122643> Greetings, ${message.author.toString()}!\n`
        + `<a:99_thongbao:1213006712618090517> Vui lòng sử dụng \`/help\` để biết thêm thông tin. Tất cả các lệnh được thiết kế dưới dạng lệnh gạch chéo để thuận tiện cho bạn. Nếu bạn cần hỗ trợ thêm hoặc có thắc mắc, vui lòng nhắn tin [Support 🛡️](https://discord.com/users/1081547609979756596)`);

        message.reply({ embeds: [embed] });
    }

    // REMOVE PREFIX FOR OWNER
    if (client.owner.includes(message.member.id) && !client.owner.includes(client.user.id) && !message.content.startsWith(prefix)) {
        prefix = "!";
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);

    // FINDING COMMANDS FROM ALIASES
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (!command) return;

    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Vote Fancy").setURL(voteUrl).setStyle(ButtonStyle.Link));

    if (client.dev.has(true) && message.author.id !== client.owner) {
        return message.reply({
            content: `👋🏻 Hey Users\n**${client.user.username} is under maintenance right now**`,
            components: [row],
        });
    }

    console.log(`[PREFIX] ${command.name} used by ${message.author.tag} from ${message.guild.name} (${message.guild.id})`);

    // DEFAULT PERMISIONS
    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const botMissingPermissions = [];

    for (const perm of botPermissions) {
        if (!message.channel.permissionsFor(message.guild.members.me).has(perm)) {
            botMissingPermissions.push(perm);
        }
    }

    if (botMissingPermissions.length > 0)
        return message.reply({
            content: `✖️ | Tôi không có một trong các quyền này \`ViewChannel\`, \`SendMessages\`, \`EmbedLinks\`.\nVui lòng kiểm tra kỹ chúng trong cài đặt kênh và vai trò máy chủ của bạn.`,
            components: [row],
        });

    // CHECK OWNER
    if (command.owner && message.author.id !== client.owner) {
        return message.reply({ content: `✖️  | Chỉ chủ sở hữu của tôi mới có thể sử dụng lệnh này!\n\nĐược tạo bởi Lynx_1ST 🛡️` });
    }

    // ERORR HANDLING
    try {
        command.run(client, message, args);
    } catch (error) {
        console.log(error);

        return message.reply({ content: `✖️  | Đã xảy ra lỗi`, components: [row] });
    }
};
