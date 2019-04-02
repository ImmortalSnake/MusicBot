const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to start')
  if(args[0]){
  let cr = args[0].toProperCase()
  let crate = inventory.crates.find(c => c === cr)
  if(!crate) return message.channel.send('Could not find that crate in your inventory')
  let kcrate = Object.keys(client.tools.crates[crate].items)
  let ecrate = Object.values(client.tools.crates[crate].items)
  console.log(ecrate)
  let m = `**You found:\n\n`
   for(let i = 0; i < kcrate.length; i++) {
     if(kcrate[i] === 'Cash') {
       let cash = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0]
        await db.add(`balance_${message.author.id}`, cash)
       m += `${cash}$:dollar:\n`
     }
     else if(client.items.Materials[kcrate[i]]) {
       let drops = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0]
       let emote = client.items.Materials[kcrate[i]].emote
       inventory.materials[kcrate[i]] ? inventory.materials[kcrate[i]] += drops : inventory.materials[kcrate[i]] = drops
       m += `${kcrate[i]}${emote} x${drops}\n`
     }
      else if(client.items.food[kcrate[i]]) {
       let drops = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0]
       let emote = client.items.food[kcrate[i]].emote
       inventory.food[kcrate[i]] ? inventory.food[kcrate[i]] += drops : inventory.food[kcrate[i]] = drops
       m += `${kcrate[i]}${emote} x${drops}\n`
     }
   }
    inventory.crates.splice(inventory.crates.indexOf(cr), 1)
    m += `**`
    let embed = new discord.MessageEmbed()
    .setTitle(`${cr} Crate`)
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor('#206694')
    .setDescription(m)
    await db.set(`inventory_${message.author.id}`, inventory)
    message.channel.send(embed)
  }
  else {
    let crates = `**`
    for(let i = 0; i < inventory.crates.length; i++){
      let e = client.tools.crates[inventory.crates[i]]
      crates += `${inventory.crates[i]} Crate x${inventory.crates.filter(r => r === inventory.crates[i]).length}\n`
    }
    crates += `**`
    if(crates === `****`) crates = 'NO crates found.. Use `s!explore` to find some'
    let embed = new discord.MessageEmbed()
    .setTitle('Your Crates')
    .setColor('#206694')
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(crates)
    .setFooter('Use `s!crate [crate]` to open one of them')
    message.channel.send(embed)
  }
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'crate',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}