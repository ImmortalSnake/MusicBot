const discord = require('discord.js');
const ms = require('ms');

module.exports.run = async (client, message, args) => {
        const bot = client;
        const uptime = bot.uptime;
        const bimage = bot.user.displayAvatarURL();
        const myinfo = new discord.MessageEmbed()
        .setTitle(bot.user.tag)
        .addField('⚙️ Version', ['1.0.0 Stable'], true)
        .addField('👑 Creator', ['ImmortalSnake#9836'], true)
        .addField('⌛ Uptime', ms(uptime), true)
        .addField('🏙️ Guilds', bot.guilds.size, true)
        .addField('👥 Members', bot.guilds.reduce((p, c) => p + c.memberCount, 0), true)
        .addField('💬 Commands', bot.commands.size, true)
        .addField('🔋 Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField('🔗 Invite', '[Click here](https://discordapp.com/api/oauth2/authorize?client_id=557831541653241857&permissions=8&scope=bot)', true)
        .addField('🤝 Support', '[Click here](https://discord.gg/b8S3HAw)', true)
        .setColor('GREEN')
        .setThumbnail(bimage)

        message.channel.send(myinfo);
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: false
}

exports.help = {
  name: 'info',
  description: 'Shows API / Latency ping.',
  group: 'general',
  usage: 'info'
}
