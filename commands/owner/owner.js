const db = require('quick.db');
const sort = require('array-sort');
const discord = require('discord.js');

module.exports.run = async (client, message, args, color, prefix) => {
  if(!client.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command')
  if(!args[0]) return message.channel.send('Correct format is `s!dbset [option] [user]`')
  let user = client.users.get(args[1]) || message.mentions.users.first()
  
  switch(args[0].toLowerCase()){
    case 'inv': {
      if(!user) return message.channel.send('Could not find that user');
      let inventory = await db.fetch(`inventory_${user.id}`);
        if(!inventory) return message.channel.send('That user does not have a player');
          let embed = new discord.MessageEmbed()
            .setTitle('Inventory')
            .setColor('GREEN')
            .setFooter(user.username, user.displayAvatarURL())
            .addField('Materials', getinv(inventory, 'Materials', client), true)
            .addField('Tools', getinv(inventory, 'Tools', client), true)
            .addField('Food', getinv(inventory, 'Food', client), true)
            .addField('Armor', getinv(inventory, 'Armor', client), true)
          message.channel.send(embed)
      break;
    }
    case 'invadd': {
      if(!user) return message.channel.send('Could not find that user');
      if(!args[2]) return message.channel.send('Please specify an item');
      let t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
      let locate = find(client, t)
      if(!locate) return message.channel.send('Could not find that item');
      let amount = parseInt(args.join('').split('-')[1]) || 1
      let inventory = await db.fetch(`inventory_${user.id}`);
      if(!inventory) return message.channel.send('That user does not have a player');
      if(locate === 'tools' && inventory[locate][t]) return message.channel.send('The player already owns this tool') 
      else if(locate === 'tools' || locate === 'armor') inventory[locate][t] = { durability: client.tools[locate.toProperCase()][t].durability, enchant: ''}
      else (inventory[locate][t]) ? inventory[locate][t] += amount : inventory[locate][t] = amount;
      await db.set(`inventory_${user.id}`, inventory)
      message.channel.send(`Successfully added ${amount} ${t} to ${user.tag}`)
      break;
    }
    case 'invrem': {
      if(!user) return message.channel.send('Could not find that user');
      if(!args[2]) return message.channel.send('Please specify an item');
      let t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
      let locate = find(client, t)
      if(!locate) return message.channel.send('Could not find that item');
      let inventory = await db.fetch(`inventory_${user.id}`);
      if(!inventory) return message.channel.send('That user does not have a player');
      if(!inventory[locate][t]) return message.channel.send('The player does not own this tool')
      delete inventory[locate][t]
      // await db.set(`inventory_${user.id}`, inventory)
      console.log(inventory)
      message.channel.send(`Successfully removed ${t} from ${user.tag}`)
      break;
    }
    case 'addcrate': {
      if(!user) return message.channel.send('Could not find that user');
      if(!args[2]) return message.channel.send('Please specify the type of crate');
      let t = args.slice(2).join(' ').toProperCase();
      if(!client.tools.crates[t]) return message.channel.send('Could not find that crate');
      let inventory = await db.fetch(`inventory_${user.id}`);
      if(!inventory) return message.channel.send('That user does not have a player');
      inventory.crates.push(t)
      await db.set(`inventory_${user.id}`, inventory)
      message.channel.send(`Successfully added a ${t} Crate to ${user.tag}`)
      break;
    }
    case 'reset': {
      if(!user) return message.channel.send('Could not find that user');
      if(!args[2]) return message.channel.send('Please specify the type');
      let t = args.slice(2).join(' ').toLowerCase();
      let inventory = await db.fetch(`inventory_${user.id}`);
      if(!inventory) return message.channel.send('That user does not have a player');
      if(!inventory[t]) return message.channel.send('Incorrect type');
      inventory[t] = client.defaultInventory[t]
      inventory.equipped = client.defaultInventory.equipped
      await db.set(`inventory_${user.id}`, inventory)
      console.log(inventory)
      message.channel.send(`Successfully reset ${t} from ${user.tag}`)
      break;
    }
    case 'shutdown': {
      await message.reply("Bot is shutting down.");
      client.destroy();
      break;
    }
    case 'reload': {
      if(!args[1]) return message.channel.send('Correct format is `s!owner reload [command]`')
      let response = await client.unloadCommand(args[1]);
      if (response) return message.reply(`Error Unloading: ${response}`);

      response = client.loadCommand(args[1]);
      if (response) return message.reply(`Error Loading: ${response}`);

      return message.channel.send(`The command \`${args[1]}\` has been reloaded`);
      break;
    }
  }
};

function find(client, name) {
  if(client.tools.Tools[name]) return 'tools'
  if(client.items.food[name]) return 'food'
  if(client.items.Materials[name]) return 'materials'
  if(client.tools.Armor[name]) return 'armor'
  return false
}

function getinv(inventory, type, client) {
  let res = {}
  let m = `**`
  for(const mat in inventory[type.toLowerCase()]) {
    res[mat] = inventory[type.toLowerCase()][mat] || 0
    //if(typeof res[mat] === 'object') res[mat] = 1
  }
  for(const v in res) {
    let e;
    if(client.items[type]) e = client.items[type][v] ;
    else if(client.tools[type]) e = client.tools[type][v];
    if(!e) e = { emote: ''  };
    let x = `x${res[v]}\n`;
    if(type === 'Tools' || type === 'Armor') x = ` | Durability ${res[v].durability}\n`
    else if( typeof res[v] === 'object') x = `x1\n` // []
    m += `${v}${e.emote} ${x}`;
  }
  m += `**`;
  return m;
}

exports.conf = {
  aliases: [],
};

// Name is the only necessary one.
exports.help = {
  name: 'owner',
  description: 'Evaluates a JS code.',
  usage: 'eval',
  group: 'owner'
}