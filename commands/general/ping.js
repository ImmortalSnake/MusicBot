module.exports.run = async (client, message) => {
	message.channel.send(`🏓 API: \`${Math.round(client.ws.ping)}\`, Latency: \`${Date.now() - message.createdTimestamp}\``);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: false
};

exports.help = {
	name: 'ping',
	description: 'Shows API / Latency ping of the bot',
	group: 'general',
	usage: 'ping'
};
