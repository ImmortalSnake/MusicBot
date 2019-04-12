const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      guildq.isPlaying = false;
			guildq.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
    }

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'pause',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'pause [command]'
}
