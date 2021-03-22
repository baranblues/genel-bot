const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const pudb = new qdb.table("cezapuani");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const ayar = require("../veriler.json");
const webhook = new WebhookClient("804276168513159219", "4flg4PIelFwDnR1q9S52taOGZ20dSmJMpP6K5qDYvliFFVqQqN0jmauZ5_PHkTgSWdyP")

module.exports.execute = async (client, message, args, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Abey").setColor(client.randomColor()).setTimestamp();
  if(!ayar.jailRolu || !ayar.jailciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Jail komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if(!uye || !reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let jaildekiler = jdb.get(`jail`) || [];
  await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.jailRolu, ayar.boosterRolu] : [ayar.jailRolu]).catch();
  if (!jaildekiler.some(j => j.includes(uye.id))) {
    let cezaID = jdb.get(`cezaid.${message.guild.id}`)+1
    jdb.add(`cezaid.${message.guild.id}`, +1);
    pudb.add(`cezapuan.${uye.id}.${message.guild.id}`, +10);
    jdb.push(`jail`, `j${uye.id}`);
    kdb.add(`kullanici.${message.author.id}.jail`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "JAIL",
      Sebep: reason,
      id : cezaID,
      Zaman: Date.now()
    });
  };
 let cezaID = jdb.get(`cezaid.${message.guild.id}`)+1
 if(uye.voice.channel) uye.voice.kick().catch();
 message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle jaile atıldı!(\`#${cezaID}\`)`)).catch();
 webhook.send(embed.setDescription(`
 Ceza Uygulayan : ${message.author}(\`${message.author.id}\`)
 Ceza Alan : ${uye}(\`${uye.id}\`)
 Sebep : **${reason}**
 Ceza İşlemi : Jail (\`#${cezaID}\`)`)).catch();
 if(uye.voice.channel) uye.voice.kick().catch();
};
module.exports.configuration = {
  name: "jail",
  aliases: ['cezalı', 'ceza'],
  usage: "jail [üye] [sebep]",
  description: "Belirtilen üyeyi jaile atar."
};