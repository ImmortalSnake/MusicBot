const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  let i = args.join(' ').toProperCase()
  let item = ifind(client, i, inventory)
  if(!item) return message.channel.send('Couldnt find that tool in your inventory');
  let locate = ilocate(i, inventory)
  let mbed = new discord.MessageEmbed()
  .setTitle('Sell')
  .setColor('#206694')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`How many ${i} would you like to sell?
**1${item.emote} = ${item.price}$**`)
  await message.channel.send(mbed)
  let collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { max: 1})
  collector.on('collect', async m => {
    let num = parseInt(m.content)
    if(!num) return message.channel.send('That was not a number. Please try again')
    if(num > inventory[locate][i]) return message.channel.send('Looks like you dont have that many')
    inventory[locate][i] -= num;
    let price = item.price * num;
    await db.set(`inventory_${message.author.id}`, inventory)
    await db.add(`balance_${message.author.id}`, price)
    let embed = new discord.MessageEmbed()
    .setTitle('Sell')
    .setColor('#206694')
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(`You sold ${num} ${i}${item.emote} for ${price}$`)
    message.channel.send(embed)
  })
}

function ifind(client, item, inventory){
  let mat = inventory.materials[item]
  let t = inventory.tools[item]
  if(mat && mat > 0) {
    return client.items.Materials[item]
  }
  else if(t) {
    return client.tools.Tools[item]
  }
  else return false;
}

function ilocate(item, inventory) {
  let mat = inventory.materials[item]
  let t = inventory.tools[item]
  if(mat) {
    return 'materials'
  }
  else if(t) {
    return 'tools'
  }
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'sell',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}