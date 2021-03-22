const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const pudb = new qdb.table("cezapuani");
const mdb = new qdb.table("level");
const sdb = new qdb.table("istatistik");
const idb = new qdb.table("kullanicicinsiyet");
const kdb = new qdb.table("kullanici");
const ayar = require("../veriler.json");
const config = require("../ayarlar.json");

module.exports.execute = async(client, message, args,  emoji) => {
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  let sorgu = args[0];
  let teyitBilgisi = ``;
  
if(sorgu == "yardım" || sorgu == "komutlar" || sorgu == "bilgi") {
    if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
  return message.channel.send(new MessageEmbed().setDescription(`
  ${config.prefix}sıfırla teyittemizle - ${config.prefix}sıfırla teyitsıfırla <ID> \`Teyitleri temizlemenize yarar.\`
  ${config.prefix}sıfırla cezatemizle - ${config.prefix}sıfırla cezasıfırla <ID> \`Cezaları temizlemenize yarar.\`
  ${config.prefix}sıfırla cezapuantemizle - ${config.prefix}sıfırla cezapuansıfırla <ID> \`Cezapuanlarını temizlemenize yarar.\`
  ${config.prefix}sıfırla siciltemizle - ${config.prefix}sıfırla sicilsıfırla <ID> \`Sicilleri temizlemenize yarar.\`
  ${config.prefix}sıfırla isimtemizle - ${config.prefix}sıfırla isimsıfırla <ID> \`İsimleri temizlemenize yarar.\`
  `)).then(x => x.delete({timeout: 50000})); 
  return 
};
  if(sorgu == "teyittemizle" || sorgu == "teyitsıfırla") {
    if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
    let kullanicitemizle = client.users.cache.get(args[1])
    let uye2 = message.guild.member(kullanicitemizle);
  if(!uye2) return message.channel.send(`Hata: Lütfen bir üye Id giriniz!  __Örn:__  \`teyit temizle <ID>\``).then(x => x.delete({timeout: 5000}));
  kdb.delete(`teyit.${uye2.id}.erkek`); 
  kdb.delete(`teyit.${uye2.id}.kiz`); 
  kdb.delete(`teyit.${uye2.id}.toplam`);
  message.channel.send(new MessageEmbed().setDescription(`${uye2} (\`${uye2.id}\`), isimli üyenin bütün teyit geçmişi temizlendi!`)).then(x => x.delete({timeout: 5000})); 
  message.react("✅")
  return 
};

if(sorgu == "cezatemizle" || sorgu == "cezasıfırla") {
  if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
  let kullanicitemizle = client.users.cache.get(args[1])
  let uye2 = message.guild.member(kullanicitemizle);
if(!uye2) return message.channel.send(`Hata: Lütfen bir üye Id giriniz!  __Örn:__  \`ceza temizle <ID>\``).then(x => x.delete({timeout: 5000}));
kdb.delete(`kullanici.${uye.id}.uyari`);
kdb.delete(`kullanici.${uye.id}.mute`);
kdb.delete(`kullanici.${uye.id}.sesmute`);
kdb.delete(`kullanici.${uye.id}.kick`); 
kdb.delete(`kullanici.${uye.id}.ban`);
kdb.delete(`kullanici.${uye.id}.jail`);
message.channel.send(new MessageEmbed().setDescription(`${uye2} (\`${uye2.id}\`), isimli üyenin bütün ceza geçmişi temizlendi!`)).then(x => x.delete({timeout: 5000})); 
message.react("✅")
return 
};

if(sorgu == "cezapuantemizle" || sorgu == "cezapuansıfırla") {
  if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
  let kullanicitemizle = client.users.cache.get(args[1])
  let uye3 = message.guild.member(kullanicitemizle);
if(!uye3) return message.channel.send(`Hata: Lütfen bir üye Id giriniz!  __Örn:__  \`ceza temizle <ID>\``).then(x => x.delete({timeout: 5000}));
pudb.delete(`cezapuan.${uye3.id}.${message.guild.id}`);
message.channel.send(new MessageEmbed().setDescription(`${uye3} (\`${uye3.id}\`), isimli üyenin bütün ceza geçmişi temizlendi!`)).then(x => x.delete({timeout: 5000})); 
message.react("✅")
return 
};
if(sorgu == "siciltemizle" || sorgu == "sicilsıfırla") {
if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
  let kullanicitemizle = client.users.cache.get(args[1])
  let uye2 = message.guild.member(kullanicitemizle);
if(!uye2) return message.channel.send(`Hata: Lütfen bir üye Id giriniz!  __Örn:__  \`sicil temizle <ID>\``).then(x => x.delete({timeout: 5000}));
kdb.delete(`kullanici.${uye2.id}.sicil`) 
return message.channel.send(new MessageEmbed().setDescription(`${uye2} (\`${uye2.id}\`), isimli üyenin bütün sicil geçmişi temizlendi!`)).then(x => x.delete({timeout: 5000})); 
message.react("✅")  
}
if(sorgu == "isimtemizle" || sorgu == "isimsıfırla") {
if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
  let kullanicitemizle = client.users.cache.get(args[1])
  let uye5 = message.guild.member(kullanicitemizle);
if(!uye5) return message.channel.send(`Hata: Lütfen bir üye Id giriniz!  __Örn:__  \`sicil temizle <ID>\``).then(x => x.delete({timeout: 5000}));
kdb.delete(`k.${uye5.id}.isimler`) 
return message.channel.send(new MessageEmbed().setDescription(`${uye5} (\`${uye5.id}\`), isimli üyenin bütün isim geçmişi temizlendi!`)).then(x => x.delete({timeout: 5000})); 
message.react("✅")  
}
};
module.exports.configuration = {
    name: "sıfırla",
    aliases: ["reset"],
    usage: "sıfırla [id]",
    description: "Belirtilen üyenin belirlenen bilgilerini sıfırlar."
};

function changeIndex(x){
  switch(x){
    case 1:
      return "1.";
    case 2:
      return "2.";
    case 3:
      return "3.";
    default:
      return `${x}.`;
  }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}