module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, djrole: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	if(!guildq.looping) {
		guildq.looping = true;
		return message.channel.send('**:repeat: Looping `ON`**');
	} else {
		guildq.looping = false;
		return message.channel.send('**:repeat: Looping `OFF`**');
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'loop',
	description: 'Loops the current playing song',
	group: 'music',
	usage: 'loop'
};
