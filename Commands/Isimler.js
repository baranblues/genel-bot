const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const ayar = require("../veriler.json");

// module.exports.onLoad = (client) => {}
module.exports.execute = (client, message, args, emoji) => {
    let embed = new MessageEmbed().setColor('RANDOM')
    if((!ayar.erkekRolleri && !ayar.kizRolleri) || !ayar.teyitciRolleri) return message.channel.send("Rol bulunamadı veya rol bilgileri girilemedi.").then(sil => sil.delete({timeout: 5000}));
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}isimsorgu @Abey/ID\``).then(sil => sil.delete({timeout: 5000}));
    let isimsorgu = kdb.get(`k.${uye.id}.isimler`) || [];
   let Liste = isimsorgu.length || `0`;
  isimsorgu = isimsorgu.reverse();
  let IsimGecmisi;
  IsimGecmisi = isimsorgu.length > 0 ? isimsorgu.map((value, index) => `\`${value.Isim}\``).join("\n") : "Üyenin herhangi bir kayıtı bulunamadı.";
    message.channel.send(embed.setDescription(`\n**Bu Kullanıcının Geçmiş İsimleri [${Liste}]**\n${IsimGecmisi}`));
    }
module.exports.configuration = {
    name: "isimler",
    aliases: ["kayıtlar","isimgecmisi"],
    usage: "isimler",
    description: "Kullanıcının isim geçmişini gösterir."
};