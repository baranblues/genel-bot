const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const pudb = new qdb.table("cezapuani");
const mdb = new qdb.table("level");
const sdb = new qdb.table("istatistik");
const kdb = new qdb.table("kullanici");
const ayar = require("../veriler.json");

module.exports.execute = async(client, message, args, emoji) => {
   if(message.channel.id !== "804260034774171658")return message.channel.send(new MessageEmbed() .setDescription(`<#804260034774171658> Burada yapabilirsin :x:`).setColor("RANDOM")).then(m => m.delete({timeout: 5000}));
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  let teyitBilgisi = ``;
  let guild = message.guild;
  let yetkiliBilgisi = ``;
  if((ayar.sahipRolu && uye.roles.cache.has(ayar.sahipRolu)) || (ayar.teyitciRolleri && ayar.teyitciRolleri.some(rol => uye.roles.cache.has(rol)))) {
    let teyit = kdb.get(`teyit.${uye.id}`) || undefined;
    if(teyit){
      let erkekTeyit = teyit.erkek || 0;
      let kizTeyit = teyit.kiz || 0;
      yetkiliBilgisi += `\`Teyitleri:\` ${erkekTeyit+kizTeyit} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
    }
  };
  if((ayar.sahipRolu && uye.roles.cache.has(ayar.sahipRolu)) || (ayar.muteciRolleri && ayar.muteciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.banciRolleri && ayar.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.banciRolleri && ayar.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.jailciRolleri && ayar.jailciRolleri.some(rol => uye.roles.cache.has(rol)))) {
    let uyari = kdb.get(`kullanici.${uye.id}.uyari`) || 0;
    let chatMute = kdb.get(`kullanici.${uye.id}.mute`) || 0;
    let sesMute = kdb.get(`kullanici.${uye.id}.sesmute`) || 0;
    let kick = kdb.get(`kullanici.${uye.id}.kick`) || 0;
    let ban = kdb.get(`kullanici.${uye.id}.ban`) || 0;
    let jail = kdb.get(`kullanici.${uye.id}.jail`) || 0;
    let toplam = uyari+chatMute+sesMute+kick+ban+jail;
    yetkiliBilgisi += `\`Cezaland??rmalar??:\` ${toplam} (**${uyari}** uyar??, **${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick, **${ban}** ban)`;
  };
  let cpuan = pudb.get(`cezapuan.${uye.id}.${message.guild.id}`);
  let durum;
    if (cpuan >= 50) durum = "Tehlikeli";
    if (cpuan < 50) durum = "G??venli";
    if (cpuan == null || cpuan == undefined) durum = "Analiz Edilemedi";
    
  let victim = kullanici;
  const embed = new MessageEmbed().setTimestamp().setColor(client.randomColor()).setFooter(message.guild.name, message.guild.iconURL({dynamic: true, size: 2048})).setAuthor(kullanici.tag.replace("`", ""), kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}))
  .addField(`__**Kullan??c?? Bilgisi**__`, `\`ID:\` ${kullanici.id}\n\`Profil:\` ${kullanici}\n ${kullanici.presence.activities[0] ? kullanici.presence.activities[0].name + ` ${(kullanici.presence.activities[0].type)}`.replace("PLAYING", "Oynuyor").replace("STREAMING", "Yay??nda").replace("LISTENING", "Dinliyor").replace("WATCHING", "??zliyor").replace("CUSTOM_STATUS", "") : (kullanici.presence.status).replace("offline", "G??r??nmez/??evrimd??????").replace("online", "??evrimi??i").replace("idle", "Bo??ta").replace("dnd", "Rahats??z Etmeyin")}\n\`Olu??turulma Tarihi:\` ${moment(kullanici.createdAt).format(`DD/MM/YYYY | HH:mm`)}`)
  .addField(`__**??yelik Bilgisi**__`, `\`Takma Ad??:\` ${uye.displayName.replace("`", "")} ${uye.nickname ? "" : "[Yok]"}\n\`Kat??lma Tarihi:\` ${moment(uye.joinedAt).format(`DD/MM/YYYY | HH:mm`)}\n\`Kat??l??m S??ras??:\` ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= uye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\n\`Rolleri:\` ${uye.roles.cache.size <= 5 ? uye.roles.cache.filter(x => x.name !== "@everyone").map(x => x).join(', ') : `Listelenemedi! (${uye.roles.cache.size})`}\n\`CezaPuan??:\`${cpuan || '0'} (\`${durum}\`)\n ${yetkiliBilgisi}`);  
  let raw = sdb.get(`raw`);
  if(!raw) raw = sdb.set(`raw`, {day: 1, lastDay: Date.now() + (1000 * 60 * 60 * 24)});
  let explodeData = sdb.get(`stats.voice.members`) || {};
  let messageData = sdb.get(`stats.text.members`) || {};
  let mostVoice = undefined;
        if(explodeData && explodeData[raw.day] && messageData[raw.day][victim.id])
            mostVoice = Object.keys(explodeData[raw.day][victim.id] || {}).sort((a,b) => explodeData[raw.day][victim.id][b] - explodeData[raw.day][victim.id][a])[0];    
  console.log(mostVoice)
        let mostText = undefined;
        if(explodeData && messageData[raw.day] && messageData[raw.day][victim.id])
            mostText = Object.keys(messageData[raw.day][victim.id] || {}).filter(a=> messageData[raw.day][victim.id][a]).sort((a,b) => messageData[raw.day][victim.id][b] - messageData[raw.day][victim.id][a])[0];    
        embed.addField(`En Aktif Kanallar??`, `**   ** ${mostText == undefined ? "" : `Mesaj: ${client.channels.cache.has(mostText) ? client.channels.cache.get(mostText) : "#deleted-channel"}: \`${numberWithCommas(messageData[raw.day][message.author.id][mostText] || 0)} mesaj\``} \n ${mostVoice == undefined ? "" : `Ses: ${client.channels.cache.has(mostVoice) ? client.channels.cache.get(mostVoice).name : "#deleted-channel"}: \`${moment.duration(explodeData[raw.day][message.author.id][mostVoice]).format("H [saat,] m [dakika]")}\``}`)
        let voiceinday = 0, voiceinweek = 0, voiceintwoweek = 0;
        if(explodeData){
            if(explodeData[raw.day] && explodeData[raw.day][victim.id]) voiceinday = Object.values(explodeData[raw.day][victim.id]).reduce((x, y) => x+y, 0);
            Object.keys(explodeData).forEach(key => {
                let day = Number(key);
                if(day <= 7 && explodeData[key] && explodeData[key][victim.id]) voiceinweek += Object.values(explodeData[key][victim.id]).reduce((x, y) => x + y, 0);
                if(day <= 14 && explodeData[key] && explodeData[key][victim.id]) voiceintwoweek += Object.values(explodeData[key][victim.id]).reduce((x, y) => x + y, 0);
            });
            embed.addField(`Ses`, `__14 G??n__: \`${moment.duration(voiceintwoweek).format("H [saat,] m [dakika]")}\` \n 7 G??n: \`${moment.duration(voiceinweek).format("H [saat,] m [dakika]")}\` \n 24 Saat: \`${moment.duration(voiceinday).format("H [saat,] m [dakika]")}\``, true)
        }
        let textinday = 0, textinweek = 0, textintwoweek = 0, mostChannel;
        if(messageData){
            if(messageData[raw.day] && messageData[raw.day][victim.id]) textinday = Object.values(messageData[raw.day][victim.id]).reduce((x, y) => x+y, 0);
            Object.keys(messageData).forEach(key => {
                let day = Number(key);
                if(day <= 7 && messageData[key] && messageData[key][victim.id]) textinweek += Object.values(messageData[key][victim.id]).reduce((x, y) => x + y, 0);
                if(day <= 14 && messageData[key] && messageData[key][victim.id]) textintwoweek += Object.values(messageData[key][victim.id]).reduce((x, y) => x + y, 0);
            });
            embed.addField(`Mesaj`, `__14 G??n__: \`${(numberWithCommas(textintwoweek))}\` \n 7 G??n: \`${(numberWithCommas(textinweek))}\` \n 24 Saat: \`${(numberWithCommas(textinday))}\``, true);
        }
        return message.channel.send(embed);
    message.channel.send(embed);
};
module.exports.configuration = {
    name: "istatistik",
    aliases: ["bilgi", "i", "me", "user", "info"],
    usage: "istatistik [??ye]",
    description: "Belirtilen ??yenin t??m bilgilerini g??sterir."
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