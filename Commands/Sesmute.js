const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const pudb = new qdb.table("cezapuani");
const jdb = new qdb.table("cezalar");
const kdb = new qdb.table("kullanici");
const ayar = require("../veriler.json");
const ms = require('ms');
const webhook = new WebhookClient("804276239749480449", "3EbrlokmCmFxIcoILiYGBm86b5EnyFptY7HB7uBSNV6Nkli0ZWZgdxYI-zzhs2AQEguC")

module.exports.execute = async (client, message, args,  emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Abey").setColor(client.randomColor()).setTimestamp();
  if(!ayar.muteciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Ses Mute komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = jdb.get(`tempsmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if(uye.voice.channel) uye.voice.setMute(true).catch();
  if (!muteler.some(j => j.id == uye.id)) {
    let cezaID = jdb.get(`cezaid.${message.guild.id}`)+1
    jdb.add(`cezaid.${message.guild.id}`, +1);
    pudb.add(`cezapuan.${uye.id}.${message.guild.id}`, +10);
    jdb.push(`tempsmute`, {id: uye.id, kalkmaZamani: Date.now()+ms(sure)})
    kdb.add(`kullanici.${message.author.id}.sesmute`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "SMUTE",
      Sebep: reason,
      id : cezaID,
      Zaman: Date.now()
    });
  };
   let cezaID = jdb.get(`cezaid.${message.guild.id}`)+1
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${sure}** boyunca **${reason}** nedeniyle seste mutelendi!(\`#${cezaID}\`)`)).catch();
  webhook.send(embed.setDescription(`
 Ceza Uygulayan : ${message.author} (\`${message.author.id}\`)
 Ceza Alan : ${uye} (\`${uye.id}\`)
 Sebep : **${reason}**
 Süre : **${sure}**
 Ceza İşlemi : Ses Mute (\`#${cezaID}\`)`)).catch();
};
module.exports.configuration = {
  name: "sesmute",
  aliases: ['ses-mute', 'voice-mute', 'sestesustur'],
  usage: "sesmute [üye] [süre] [sebep]",
  description: "Belirtilen üyeyi seste belirtilen süre kadar muteler."
};