const { MessageEmbed, Discord } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = require("../veriler.json");

module.exports.execute = async (client, message, args,  emoji) => {
    let yetkili = ayar.teyitciRolleri.id || undefined;
    if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(new MessageEmbed().setDescription("Bu komutu kullanabilmek için gerekli rollere sahip değilsin!")).then(x => x.delete({timeout: 5000}));
   
      let abey = "**Sesli Kanalda Olmayan Yetkililer:**\n";
      message.guild.roles.cache.get("804259943203995648").members.map(r => {
        abey += !r.voice.channel ? "•  <@" + r.user.id + ">\n" : "";
      });
      message.channel.send("" + abey + "").then(s => s.s);
    };
module.exports.configuration = {
  name: "sesteki",
  aliases: ["sesteolmayan"],
  usage: "isim [üye] [isim] [yaş]",
  description: "Belirtilen üyenin isim ve yaşını değiştir"
};