const db = require('quick.db');
const discord = require('discord.js');

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to get a pickaxe')
  if(!args[0]) return message.channel.send('Correct format is s!craft [tool]')
  let t = args.join(' ').toProperCase()
  let tool = ok(t, client)
  if(!tool) return message.channel.send('That tool is not craftable right now!')
  inventory = await client.checkInventory(message.author)
  if(!check(inventory, tool)) return message.channel.send('You do not have enough materials')
  let embed = new discord.MessageEmbed()
    .setTitle('Craft')
    .setColor('#206694')
    .setFooter(message.author.username, message.author.displayAvatarURL())
  switch(tool.type) {

    case 'Armor': {
    for(const mat in client.tools.Armor[t].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Armor[t].materials[mat]
    }
   (inventory.armor[t]) ? inventory.armor[t]++ : inventory.armor[t] = 1;
    embed.setDescription(`Successfully crafted a ${t} ${tool.emote}.
Use \`s!equip ${t}\` to equip it!`)
  await db.set(`inventory_${message.author.id}`, inventory)
  message.channel.send(embed)
    return;
    break;
    }
    case 'Other': {
      for(const mat in tool.materials) {
       inventory.materials[mat.toProperCase()] -= tool.materials[mat]
      }
      for(const oth in tool.other) {
       inventory.other[oth.toProperCase()] -= tool.other[oth]
       }
      if(tool.onetime){
        if(inventory.other[t]) return message.channel.send(`You already have a ${t}`)
        inventory.other[t] = {} 
      } else {
        inventory.other[t] ? inventory.other[t]++ : inventory.other[t] = 1
      }
      embed.setDescription(`Successfully crafted a ${t} ${tool.emote}`)
      message.channel.send(embed)
      await db.set(`inventory_${message.author.id}`, inventory)
      return;
      break;
    }
    case 'Normal': {
      generate(inventory, tool, t, message);
      return;
      break;
    }
  }
  /*if(client.tools.Armor[t]) {
    for(const mat in client.tools.Armor[t].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Armor[t].materials[mat]
    }
   (inventory.armor[t]) ? inventory.armor[t]++ : inventory.armor[t] = 1;
    embed.setDescription(`Successfully crafted a ${t} ${tool.emote}.
Use \`s!equip ${t}\` to equip it!`)
   await db.set(`inventory_${message.author.id}`, inventory)
  message.channel.send(embed)
    return
  }
  if(t == 'Chest') {
    inventory.size += client.tools.Tools['Chest'].size
    for(const mat in client.tools.Tools['Chest'].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Tools['Chest'].materials[mat]
    }
    console.log(inventory)
    return
  }
  else if(t == 'Furnace') {
    if (inventory.other['Furnace']) return message.channel.send('You already have a furnace') 
    inventory.other['Furnace'] = {}
    for(const mat in client.tools.Tools['Furnace'].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Tools['Furnace'].materials[mat]
    }
   await db.set(`inventory_${message.author.id}`, inventory)
   embed.setDescription(`Successfully crafted a Furnace ${client.tools.Tools['Furnace'].emote}.
Use \`s!cook [food]\` to start cooking!`)
  message.channel.send(embed)
    return
  }
  else if(t == 'Nether Portal') {
    if (inventory.other['Nether Portal']) return message.channel.send('You already have a Nether Portal') 
    inventory.other['Nether Portal'] = {}
    for(const mat in client.tools.Tools['Nether Portal'].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Tools['Nether Portal'].materials[mat]
    }
   // await db.set(`inventory_${message.author.id}`, inventory)
    console.log(inventory)
    embed.setDescription(`Successfully crafted a Nether Portal ${client.tools.Tools['Nether Portal'].emote}.
Use \`s!dim nether\` to go to the nether world!`)
  message.channel.send(embed)
    return
  }*/
}

function check(inventory, tool) {
  for(const mat in tool.materials) {
    if(tool.materials[mat] > inventory.materials[mat.toProperCase()]) return false
  }
  if(tool.other) {
  for(const oth in tool.other) {
    if(tool.other[oth] > inventory.other[oth.toProperCase()] || !inventory.other[oth.toProperCase()]) return false
   }
  }
  return true;
}

function ok(tool, client) {
  for(const t in client.tools.Tools) {
    let x = client.tools.Tools[tool.toProperCase()]
    if(x) return x
  }
  for(const t in client.tools.Armor) {
    let x = client.tools.Armor[tool.toProperCase()]
    if(x) return x
  }
  if(client.tools.Other[tool.toProperCase()]) return client.tools.Other[tool.toProperCase()]
  return false
}

async function generate(inventory, tool, name, message) {
  for(const mat in tool.materials) {
    inventory.materials[mat.toProperCase()] -= tool.materials[mat]
  }
  (inventory.tools[name]) ? inventory.tools[name]++ : inventory.tools[name] = 1;
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = new discord.MessageEmbed()
  .setTitle('Craft')
  .setColor('#206694')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Successfully crafted a ${name} ${tool.emote}.
Use \`s!equip ${name}\` to equip it`)
  message.channel.send(embed)
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'craft',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'craft'
}