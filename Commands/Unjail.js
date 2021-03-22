const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const ayar = require("../veriler.json");
const db = new qdb.table("ayarlar");
const webhook = new WebhookClient("804276168513159219", "4flg4PIelFwDnR1q9S52taOGZ20dSmJMpP6K5qDYvliFFVqQqN0jmauZ5_PHkTgSWdyP")
module.exports.execute = async (client, message, args,  emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Abey").setColor(client.randomColor()).setTimestamp();
  if(!ayar.jailRolu || !ayar.jailciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Jail komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let jaildekiler = jdb.get(`jail`) || [];
  let tempjaildekiler = jdb.get(`tempjail`) || [];
  uye.roles.set(ayar.teyitsizRolleri || []).catch();
  if (jaildekiler.some(j => j.includes(uye.id))) jdb.set(`jail`, jaildekiler.filter(x => !x.includes(uye.id)));
  if (tempjaildekiler.some(j => j.id === uye.id)) jdb.set(`tempjail`, tempjaildekiler.filter(x => x.id !== uye.id));
  if(uye.voice.channel) uye.voice.kick().catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından jailden çıkarıldı!`)).catch();
  webhook.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından jailden çıkarıldı!`)).catch();
};
module.exports.configuration = {
  name: "unjail",
  aliases: ['uncezalı'],
  usage: "unjail [üye]",
  description: "Belirtilen üyeyi jailden çıkarır."
};