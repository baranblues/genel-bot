const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = require("../veriler.json");

// module.exports.onLoad = (client) => {}
module.exports.execute = (client, message, args,  emoji) => {
  if(!message.member.roles.cache.has(ayar.ekipRolu) && !message.member.hasPermission('ADMINISTRATOR'))
  return message.react(client.emoji("iptal"));
  let ekipRolu = ayar.ekipRolu || undefined;
  const embed = new MessageEmbed().setTimestamp()
  message.channel.send((`
  **Aktif Üye ・** ${client.emojiSayi(`${message.guild.members.cache.filter(u => u.presence.status != "offline").size}`)}                 **Taglı Üye ・** ${client.emojiSayi(`${message.guild.roles.cache.get(ekipRolu).members.size}`) || "Ayarlanmamış"}\n
                      **Sesteki Üye ・** ${client.emojiSayi(`${message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b)}`)}`));
};

module.exports.configuration = {
    name: "sesli",
    aliases: ["seslisay","sessay"],
    usage: "say",
    description: "Sunucu sayımı."
};