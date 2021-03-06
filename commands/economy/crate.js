exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	if(args[0]) {
		const cr = args[0].toProperCase();
		const crate = inventory.crates.find(c => c === cr);

		if(!crate) return message.channel.send('Could not find that crate in your inventory');
		const kcrate = Object.keys(mc.crates[crate].items);
		const ecrate = Object.values(mc.crates[crate].items);
		let m = '**You found:\n\n';
		for(let i = 0; i < kcrate.length; i++) {
			if(kcrate[i] === 'Cash') {
				const cash = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0];
				inventory.money += cash;
				m += `${cash}$:dollar:\n`;
			}
			else if(mc.Materials[kcrate[i]]) {
				const drops = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0];
				const emote = mc.Materials[kcrate[i]].emote;
				const it = inventory.materials.find(x=>x.name === kcrate[i]);
				it ? it.value += drops : inventory.materials.push({ name: kcrate[i], value: drops });
				m += `${kcrate[i]}${emote} x${drops}\n`;
			}
			else if(mc.Food[kcrate[i]]) {
				const drops = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0];
				const emote = mc.Food[kcrate[i]].emote;
				const it = inventory.food.find(x=>x.name === kcrate[i]);
				it ? it.value += drops : inventory.food.push({ name: kcrate[i], value: drops });
				m += `${kcrate[i]}${emote} x${drops}\n`;
			}
		}
		inventory.crates.splice(inventory.crates.indexOf(cr), 1);
		m += '**';
		const embed = client.embed(message, { title: `**${cr} Crate**` }).setDescription(m);
		await mc.set(inventory, ['materials', 'tools', 'food']);
		message.channel.send(embed);
	}
	else {
		let crates = '**';
		let x = inventory.crates;
		for(let i = 0; i < x.length; i++) {
			crates += `${x[i]} Crate x${x.filter(r => r === x[i]).length}\n`;
			x = x.filter(r => r !== x[i]);
		}
		crates += `**\n\nUse \`${prefix}crate [crate]\` to open one of them`;
		if(crates === '****') crates = `NO crates found.. Use \`${prefix}explore\` to find some`;
		const embed = client.embed(message, { title: '**Your Crates**' }).setDescription(crates);
		message.channel.send(embed);
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'crate',
	description: 'Shows all crates that you own and opens them!',
	group: 'economy',
	usage: 'coin [crate type]'
};