const { MessageEmbed, WebhookClient } = require("discord.js");
const ayar = require("../veriler.json");
const webhook = new WebhookClient("804276114691325962", "rM2yAxgvSE2PadXn6zGmSfqfxjCU2DERNbL7xP6tjXLUANvkNg2xHTFpzx0nraZ7UM2k")
module.exports.execute = async (client, message, args, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Abey").setColor(client.randomColor()).setTimestamp();
  if(!ayar.banciRolleri) return message.channel.send(embed.setDescription("Sunucuda herhangi bir `YASAKLAMA(BAN)` rolü tanımlanmamış. `PANEL` komutunu kullanmayı deneyin.")).then(x => x.delete({timeout: 5000}));
  if(!ayar.banciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için gerekli rollere sahip değilsin!")).then(x => x.delete({timeout: 5000}));
  if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription("Geçerli bir kişi ID'si belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  let kisi = await client.users.fetch(args[0]);
  if(kisi) {
    let reason = args.splice(1).join(" ") || "sebep belirtilmedi";
    message.guild.members.unban(kisi.id).catch(err => message.channel.send(embed.setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({timeout: 5000})));
    message.react(client.emojiler.onay).catch();
    webhook.send(new MessageEmbed().setTimestamp().setFooter("Abey").setTitle('Ban Kaldırıldı!').setDescription(`**Kaldıran Yetkili:** ${message.author} (${message.author.id})\n**Banı Kaldırılan Üye:** ${kisi.tag} (${kisi.id})`));
  } else {
    message.channel.send(embed.setDescription("Geçerli bir kişi ID'si belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  };
};
module.exports.configuration = {
  name: "unban",
  aliases: ["yasak-kaldır"],
  usage: "unban [id] [isterseniz sebep]",
  description: "Belirtilen kişinin banını kaldırır."
};