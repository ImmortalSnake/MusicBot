const fetch = require('node-superfetch');

module.exports.run = async (client, message, args) => {
 const text = args.join(' ');
 const url = `https://dankmemer.services/api/youtube?avatar1=${message.author.avatarURL()}&username1=${message.author.username}&text=${text}`;

  message.channel.startTyping();
    fetch.get(url, {
        headers: {
            "Authorization": process.env.dank,
        },
    }).then(async res => {
        await message.channel.send({
           files: [{
               attachment: res.body,
               name: 'youtube.png',
           }],
        }).then(() => message.channel.stopTyping());
    }).catch(err => {
             console.error(err);
             message.channel.stopTyping();
            });
      return;
 }

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'youtube',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'youtube [command]'
}

