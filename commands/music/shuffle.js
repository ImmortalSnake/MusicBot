module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, playing: true, djrole: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	guildq.queue = shuffle(guildq.queue);
	message.channel.send('**Shuffled The Queue**');
};


function shuffle(brr) {
	const cp = brr[0];
	const arr = brr.slice(1);
	for (let i = arr.length; i; i--) {
		const j = Math.floor(Math.random() * i);
		[arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
	}
	arr.unshift(cp);
	return arr;
}

exports.conf = {
	aliases: ['shuff'],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'shuffle',
	description: 'Shuffles the queue',
	group: 'music',
	usage: 'shuffle'
};
