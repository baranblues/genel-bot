const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const pudb = new qdb.table("cezapuani");
const jdb = new qdb.table("cezalar");
const ayar = require("../veriler.json");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const webhook = new WebhookClient("804362972771778563", "xoLOis7vrj3gMe2uw29qZa5P_9mpOc5zjLo9FKmYfqGHdoqJoj4fLwKjY5kJg7ugl3Qy")

module.exports.execute = async (client, message, args, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Abey").setColor(client.randomColor()).setTimestamp();
  if(!ayar.enAltYetkiliRolu) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(message.member.roles.highest.position < message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Uyarı komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if(!uye || !reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
    let cezaID = jdb.get(`cezaid.${message.guild.id}`)+1  
    pudb.add(`cezapuan.${uye.id}.${message.guild.id}`, +5);
    kdb.add(`kullanici.${message.author.id}.uyari`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "UYARI",
      Sebep: reason,
      id : cezaID,
      Zaman: Date.now()
    });
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle uyarıldı!(\`#${cezaID}\`)`)).catch();
  webhook.send(embed.setDescription(`
  Ceza Uygulayan : ${message.author}(\`${message.author.id}\`)
 Ceza Alan : ${uye}(\`${uye.id}\`)
 Sebep : **${reason}**
 Ceza İşlemi : Uyarı (\`#${cezaID}\`)`)).catch();
};
module.exports.configuration = {
  name: "uyarı",
  aliases: ['sustur'],
  usage: "uyarı [üye] [sebep]",
  description: "Belirtilen üyeyi uyarır."
};