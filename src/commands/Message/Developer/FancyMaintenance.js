const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "maintenance",
    description: "maintenance mode.",
    category: "Developer",
    aliases: ["maintenance", "mt"],
    owner: true,
    run: async (client, message, args) => {
        const value = args[0];
        const mode = ["enable", "disable"];

        if (!value) return message.reply({ content: `✖️  | You didn't provide any maintenance mode: \`${mode.join(", ")}\`` });

        if (!mode.includes(args[0]))
            return message.reply({ content: `✖️  | You didn't provide any valid maintenance mode: \`${mode.join(", ")}\`` });

        const enable = true;

        const embed = new EmbedBuilder().setColor(client.color).setTimestamp();

        if (value === "enable") {
            if (client.dev.has(enable)) {
                embed.setDescription(`✖️  | Maintenance mode is already: \`Enabled\``);

                return message.reply({ embeds: [embed] });
            }

            await client.dev.add(enable);

            embed.setDescription(`<a:check_mark:1213409895483965490> | Maintenance mode has been: \`Enabled\``);

            return message.reply({ embeds: [embed] });
        }

        if (value === "disable") {
            if (!client.dev.has(enable)) {
                embed.setDescription(`✖️  | Maintenance mode is already: \`Disabled\``);

                return message.reply({ embeds: [embed] });
            }

            await client.dev.delete(enable);

            embed.setDescription(`<a:check_mark:1213409895483965490> | Maintenance mode has been: \`Disabled\``);

            return message.reply({ embeds: [embed] });
        }
    },
};
