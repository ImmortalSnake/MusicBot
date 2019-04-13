const db = require('quick.db');
const discord = require('discord.js')
const ms = require('ms')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` to start playing!');
  let embed = new discord.MessageEmbed()
  .setColor('#206694')
  if(!args[0]) {
    let m = 'Use `s!shop bonus` or `s!shop boosters` to see all the items in the shop!'
    message.channel.send(m)
  } else {
    let t = args[0].toProperCase()
    let shop = client.shop[t]
    let id = parseInt(args[1])
    
    if (id) {
      let item = getItem(id, shop)
      if(!item) return message.channel.send('Could not find an item with that id!')
      let mat = item.price[0];
      if(t === 'Boosters') {
        if(inventory.drills[item.name]) return message.channel.send(`You already have a drill ${ms(inventory.drills[item.name])} left for it to finish`);
        inventory.drills[item.name] = item.time;
      }
      if(!inventory.materials[mat] || inventory.materials[mat] < item.price[1]) return message.channel.send('You do not have enough materials')
      inventory.materials[mat] -= item.price[1]
      console.log(inventory)
    } else {
      if(!shop) return message.channel.send('Use `s!shop bonus` or `s!shop boosters` to see all the items in the shop!');
      embed.setTitle(`**${t}**`)
      let m = ''
      for(const s in shop) {
        let mat = shop[s].price[0]
        m += `ID: ${shop[s].id} ~ **${s}** ~ Price: ${shop[s].price[1]} ${client.items.Materials[mat].emote}\n`
      }
      m += `\n Use \`s!shop ${t} <id>\` to buy an item`
      embed.setDescription(m)
      message.channel.send(embed)
    }
  }
}

function getItem(id, shop) {
  for(const s in shop) {
    if(shop[s].id == id) return shop[s];
  }
  return false;
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'shop',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}