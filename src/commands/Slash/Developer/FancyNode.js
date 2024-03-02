const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "node",
    description: "Check node of bot!.",
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
    run: async (client, message) => {
        const nodes = client.poru.leastUsedNodes;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${client.user.username} Node Fancy Premium Information!`,
                iconURL: message.guild.iconURL({ dynamic: false }),
            })
            .setColor(client.color)
            .setTimestamp(Date.now());

        for (const node of nodes) {
            const stats = node.stats;
            const fields = [
                {
                    name: `**Node ${node.name} đã kết nối **`,
                    value: `\`\`\`Số lượng kết nối: ${node.stats.players}\nĐang phát: ${node.stats.playingPlayers}\nT/g hoạt động: ${new Date(
                        node.stats.uptime,
                    )
                        .toISOString()
                        .slice(11, 19)}\`\`\``,
                    inline: false,
                },
                {
                    name: "Thông tin CPU",
                    value: `\`\`\`Số nhân: ${node.stats.cpu.cores}\nTải hệ thống: ${(
                        Math.round(node.stats.cpu.systemLoad * 100) / 100
                    ).toFixed(2)}%\nLavalink: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%\`\`\``,
                    inline: false,
                },
                {
                    name: "Thông tin bộ nhớ",
                    value: `\`\`\`Bộ nhớ dự trữ: ${Math.round(node.stats.memory.reservable / 1024 / 1024)}MB\nBộ nhớ đã sử dụng: ${Math.round(
                        node.stats.memory.used / 1024 / 1024,
                    )}MB\nBộ nhớ khả dụng: ${Math.round(node.stats.memory.free / 1024 / 1024)}MB\nAllocated Memory: ${Math.round(
                        node.stats.memory.allocated / 1024 / 1024,
                    )}MB\`\`\``,
                    inline: false,
                },
            ];

            embed.addFields(fields);
        }

        return message.channel.send({ embeds: [embed] });
    },
};
