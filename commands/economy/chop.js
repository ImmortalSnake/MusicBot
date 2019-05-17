exports.run = async (client, message, args, { prefix, mc }) => {
	const inventory = await mc.get(message.author.id);

	if(!inventory) return message.channel.send(`You do not have an axe. Use the \`${prefix}start\` command to get an axe`);
	if(inventory.dimension === 'Nether') return message.channel.send('You cant chop wood in the Nether! Use `s!dim overworld` to go back to the overworld');
	if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100');

	if(Date.now() - inventory.lastactivity >= mc.rhunger && inventory.hunger < 75) inventory.hunger += 25;
	if(inventory.hunger % 2 === 0 && inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food');

	const eaxe = inventory.equipped.find(e => e.name === 'axe').value; // equipped axe name
	const iaxe = inventory.tools.find(e => e.name === eaxe).value; // axe in inventory
	const axe = mc.Tools[eaxe]; // axe stats

	if(iaxe.durability < 1) return message.channel.send(`You cannot use this axe anymore as it is broken, please use \`s!repair ${eaxe}\` to repair it`);

	inventory.hunger -= 0.25;
	const drops = Math.floor(Math.random() * axe.drops[1]) + axe.drops[0];
	const wood = mc.Materials.Wood;
	inventory.materials.find(m => m.name === 'Wood').value += drops;
	iaxe.durability--;
	let apple = false;
	let m = '';
	const rand = Math.random();

	if(rand > 0.9) apple = true;
	if(apple) {
		const a = inventory.food.find(f=> f.name === 'Apple');
		a ? a.value++ : inventory.food.push({ name: 'Apple', value: 1 });
		m = `\n You found an Apple ${mc.Food['Apple'].emote}`;
	}

	inventory.lastactivity = Date.now();
	await mc.set(inventory, ['materials', 'tools', 'food']);

	const embed = client.embed(message, { title: '**Chop**' })
		.setDescription(`**${message.author.username} chopped wood with ${axe.emote}
You got ${drops} ${wood.emote}${m}**`);
	return await message.channel.send(embed);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 5000
};

exports.help = {
	name: 'chop',
	description: 'Chop trees to get wood! Apple drops ocassionaly',
	group: 'economy',
	usage: 'chop'
};