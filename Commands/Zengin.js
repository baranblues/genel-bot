const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = require("../veriler.json");

module.exports.execute = async (client, message, args,  emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(client.randomColor()).setTimestamp();
  let booster = ayar.boosterRolu || undefined;
  if(!booster) return message.channel.send("Böyle Bir rol Bulanamadı!")
   if(!message.member.roles.cache.has(booster)) return message.reply("Bu Komutu Kullanabilmek İçin Booster Rolüne Sahip Olmalısın!").then(chery=> chery.delete({timeout: 5000}))
    let uye = message.guild.members.cache.get(message.author.id);
    let isim = args[0]
    let yazilacakIsim;
        if(!isim) return message.channel.send(embed.setDescription("Geçerli bir isim belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
  
uye.setNickname(`${yazilacakIsim}`).catch()
};
module.exports.configuration = {
  name: "zengin",
  aliases: ["booster"],
  usage: "isim [üye] [isim] [yaş]",
  description: "Belirtilen üyenin isim ve yaşını değiştir"
};