exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	const a = args.join(' ').toProperCase();
	const f = inventory.food.find(x=>x.name === a);
	if(!f) return message.channel.send(`Could not find that food in your inventory. Use \`${prefix}eat [food]\` to eat food and use \`${prefix}inv\` to see all the food you have in your inventory`);
	const food = mc.Food[a];
	const embed = client.embed(message, { title: '**Eat**' })
		.setDescription(`You ate a **${a}** ${food.emote}
You got **${food.energy}+** Energy!`);
	message.channel.send(embed);
	inventory.hunger += food.energy;
	f.value--;
	await mc.set(inventory, ['food']);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'eat',
	description: 'Eat food to gain health and energy',
	group: 'economy',
	usage: 'eat [food name]'
};