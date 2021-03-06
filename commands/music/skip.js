module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	if (guildq.queue[0].skippers.indexOf(message.author.id) === -1) {
		const reqvotes = (Math.ceil((guildq.voiceChannel.members.size - 1) / 2) - guildq.queue[0].skippers.length);
		guildq.queue[0].skippers.push(message.author.id);
		if(message.member.roles.has(settings.djRole) || message.member.hasPermission('ADMINISTRATOR')) {
			guildq.dispatcher.end();
			return message.reply('✅ Your skip has been acknowledged. Skipping now!');
		} else if (reqvotes === 0) {
			guildq.dispatcher.end();
			return message.reply('✅ Your skip has been acknowledged. Skipping now!');
		} else message.reply(` your skip has been acknowledged. You need **${reqvotes}**  more skip votes!`);
	} else {
		message.reply(' you already voted to skip!');
	}
};

exports.conf = {
	aliases: ['s'],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'skip',
	description: 'Skips the current playing music',
	group: 'music',
	usage: 'skip'
};

