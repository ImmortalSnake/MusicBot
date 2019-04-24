const db = require('quick.db');
const discord = require('discord.js')
const playing = new Set();

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a hoe .Use the `s!start` command to get an hoe');
  if(inventory.dimension === 'Nether') return message.channel.send('You cant farm in the Nether! Use `s!dim overworld` to go back to the overworld');
  let hoe = inventory.equipped.hoe
  if(!hoe) return message.channel.send('You do not have an hoe. Use `s!craft wooden hoe` to get a hoe');
  if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100')
  if(inventory.tools[hoe].durability < 1) return message.channel.send(`You cannot use this hoe anymore as it is broken, please use \`s!repair ${hoe}\` to repair it`)
  inventory = await client.checkInventory(message.author)
  if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25
  if(inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food')
  inventory.lastactivity = Date.now()
  inventory.hunger -= 2
  inventory.tools[hoe].durability--
  let ehoe = client.tools.Tools[hoe]
  let drops = Math.floor(Math.random() * ehoe.drops[1]) + ehoe.drops[0]
  let rand = ['Potato', 'Carrot', 'Wheat'].random()
  let food = client.items.Food[rand]
  inventory.food[rand] ? inventory.food[rand]+=drops : inventory.food[rand] = drops
  // inventory.materials.Wood = inventory.materials.Wood + drops
   await db.set(`inventory_${message.author.id}`, inventory);
  let embed = client.embed(message)
  .setTitle('Farm')
  .setDescription(`**${message.author.username} farmed with ${ehoe.emote}.
You got ${drops} ${food.emote}.**`)
  message.channel.send(embed); 

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [],
    botPerms: [],
    cooldown: 300 * 1000
};
  
exports.help = {
    name: "farm",
    description: "Farm for food!",
    group: 'economy',
    usage: "farm",
};