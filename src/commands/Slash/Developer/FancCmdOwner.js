const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "owner-help",
  description: "Display all commands for the owner.",
  category: "Developer",
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
    owner: true,
    premium: false,
  },
  run: async (client, interaction) => {
    // Defer the interaction to prevent timeouts
    await interaction.deferReply({ ephemeral: false });

    // Define premium and developer commands for better readability
    const premiumCommands = [
      "+generate : Tạo mã người dùng cao cấp. ",
      "+unpremium : Xóa người dùng khỏi bản cao cấp.",
      "+list : Nhận danh sách tất cả người dùng cao cấp.",
    ].join("\n");

    const developerCommands = [
      "+ban : Cấm người dùng sử dụng bot.",
      "+maintenance : Kích hoạt chế độ bảo trì.",
      "+eval : Đánh giá bot.",
    ].join("\n");

    // Build the embed with a more professional and organized structure
    const embed = new EmbedBuilder()
      .setTitle("Lệnh của chủ sở hữu")
      .setDescription(`
        <a:99_yellowcrown:1213402242015699074> **Lệnh cao cấp**
        \`\`\`yaml
        ${premiumCommands}
        \`\`\`

        <:developer:1212982747950350346> **Lệnh Developers**
        \`\`\`yaml
        ${developerCommands}
        \`\`\`
      `)
      .setColor(client.color)
      .setURL("https://github.com/Lynx-1ST"); // Replace with your actual support server URL

    // Send the edited reply with the embed
    return interaction.editReply({ embeds: [embed] });
  },
};
