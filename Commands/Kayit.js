const { MessageEmbed, Discord } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const pdb = require("quick.db")
const kdb = new qdb.table("kullanici");
const idb = new qdb.table("kullanicicinsiyet");
const ayar = require("../veriler.json");
const Ayarlar = require("../ayarlar.json");
const tepkiler = [
    Ayarlar.erkekTepkiId,
    Ayarlar.kadinTepkiId,
];
module.exports.execute = async (client, message, args, emoji, member) => {
    let embed = new MessageEmbed().setColor('0x2f3136').setFooter(`Abey`)
    if((ayar.erkekRolleri && !ayar.kizRolleri) || !ayar.teyitciRolleri) return message.channel.send("Sistemsel hata: Rol bulunamadı veya rol bilgileri girilemedi.").then(sil => sil.delete({timeout: 5000}));
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`kayıt @Abey/ID isim yaş\``).then(sil => sil.delete({timeout: 5000}));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(`Hata: Belirlediğiniz üye sizden yetkili veya aynı yetkidesiniz.`).then(sil => sil.delete({timeout: 5000}));
    if(ayar.erkekRolleri.some(erkek => uye.roles.cache.has(erkek))) return message.channel.send(`Hata: Belirlediğiniz üye sunucuda zaten kayıtlı ne için tekrardan kayıt ediyorsun?`).then(sil => sil.delete({timeout: 5000}));
    if(ayar.kizRolleri.some(kadin => uye.roles.cache.has(kadin))) return message.channel.send(`Hata: Belirlediğiniz üye sunucuda zaten kayıtlı ne için tekrardan kayıt ediyorsun?`).then(sil => sil.delete({timeout: 5000}));
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let BelirlenenIsim;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!isim || !yaş) return message.channel.send(`Hata: Lütfen tüm argümanları doldurunuz!  __Örn:__  \`kayıt @Abey/ID isim yaş\``).then(sil => sil.delete({timeout: 5000}));
        BelirlenenIsim = `${uye.user.username.includes(ayar.Tag) ? ayar.Tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.Tag || ""))} ${isim} | ${yaş}`;
        uye.setNickname(`${BelirlenenIsim}`).catch();
        if (pdb.fetch(`taglıAlım.${message.guild.id}`)) {
          if(!uye.user.username.includes(ayar.tag) && !uye.roles.cache.has(Ayarlar.vipRolu) && !uye.roles.cache.has(ayar.boosterRolu)) {
          message.channel.send(new MessageEmbed().setDescription(`${uye} isimli üye tagımızı almadığı için kayıt işlemi tamamlanamadı.`)).then(x => x.delete({timeout: 5000}));    
          return;
          }}
          let isimdata = kdb.get(`k.${uye.id}.isimler`) || [];
          let isimler = isimdata.length > 0 ? isimdata.map((value, index) => `\`${value.Isim}\``).join("\n") : "Sistem de isim kaydı bulunamadı!";
                  kdb.push(`k.${uye.id}.isimler`, {
                    Isim: BelirlenenIsim,
                    Yetkili: message.author.id,
                    Zaman: Date.now()
                });
          kdb.push(`k.${uye.id}.isimler`, {
            Isim: BelirlenenIsim,
            Yetkili: message.author.id,
            Zaman: Date.now()
        });
          let phentos = await message.channel.send(embed
            .setDescription(`${uye} isimli kişinin cinsiyetini tepkilerle belirleyin!`)
            ).then(async m => {
            await m.react(Ayarlar.erkekTepkiId)
            await m.react(Ayarlar.kadinTepkiId)
            return m;
          }).catch(err => undefined);
          let tepki = await phentos.awaitReactions((reaction, user) => user.id == message.author.id && tepkiler.some(emoji => emoji == reaction.emoji.id), { errors: ["time"], max: 1, time: 15000 }).then(coll => coll.first()).catch(err => { message.channel.send(embed.setDescription(`${message.author}, 15 saniye boyunca cevap vermediği için kayıt işlemi iptal edildi.`)).then(sil => sil.delete({timeout: 7500})); phentos.delete().catch(); return; });
          if(!tepki) return;
          phentos.delete()
          if (tepki.emoji.id == Ayarlar.erkekTepkiId) {
            kdb.add(`teyit.${message.author.id}.toplam`, 1); 
            kdb.add(`teyit.${message.author.id}.erkek`, 1);
            idb.push(`veri.${uye.id}.cinsiyet`, `erkek`);
            let erkek = uye.roles.cache.filter(x => x.managed).map(x => x.id).concat(ayar.erkekRolleri)
            await uye.roles .set(erkek)
            let erkek1 = kdb.get(`teyit.${message.author.id}.erkek`);
            let kadin1 = kdb.get(`teyit.${message.author.id}.kiz`);
            let toplam = kdb.get(`teyit.${message.author.id}.toplam`);
            message.channel.send(embed.addField(`Bu Kullanıcının Geçmiş İsimleri [${isimdata.length}]` || `0`, isimler, true).setFooter(`Erkek Kaydın : ${erkek1} Toplam Kaydın : ${toplam}, Kız Kaydın : ${kadin1}`).setDescription(`${uye}, adlı üye başarıyla ${message.author}, tarafından **Erkek** olarak kayıt edildi.`)).then(sil => sil.delete({timeout: 25000}));    } else {
              if(ayar.chatKanali && client.channels.cache.has(ayar.chatKanali)) client.channels.cache.get(ayar.chatKanali).send(`Aramıza hoşgeldin **${uye}**! Kuralları okumayı unutma!`).then(x => x.delete({timeout: 10000})) 
              if (tepki.emoji.id == Ayarlar.kadinTepkiId) {
            kdb.add(`teyit.${message.author.id}.toplam`, 1); 
            kdb.add(`teyit.${message.author.id}.kiz`, 1);
            idb.push(`veri.${uye.id}.cinsiyet`, `kadin`);
            let kadın = uye.roles.cache.filter(x => x.managed).map(x => x.id).concat(ayar.kizRolleri)
            await uye.roles.set(kadın)
            let erkek1 = kdb.get(`teyit.${message.author.id}.erkek`);
            let kadin1 = kdb.get(`teyit.${message.author.id}.kiz`);
            let toplam = kdb.get(`teyit.${message.author.id}.toplam`);
            message.channel.send(embed.addField(`Bu Kullanıcının Geçmiş İsimleri [${isimdata.length}]` || `0`, isimler, true).setFooter(`Erkek Kaydın : ${erkek1} Toplam Kaydın : ${toplam}, Kız Kaydın : ${kadin1}`).setDescription(`${uye}, adlı üye başarıyla ${message.author}, tarafından **Kadın** olarak kayıt edildi.`)).then(sil => sil.delete({timeout: 25000}));
            if(ayar.chatKanali && client.channels.cache.has(ayar.chatKanali)) client.channels.cache.get(ayar.chatKanali).send(`Aramıza hoşgeldin **${uye}**! Kuralları okumayı unutma!`).then(x => x.delete({timeout: 10000})) 
        } 
       } if(uye.user.username.includes(ayar.Tag)) uye.roles.add(ayar.ekipRolu); 
       message.react("✅"); 
       return;
    }
module.exports.configuration = {
  name: "kayıt",
  aliases: ["kayıt","e","kadın","kız","erkek","k"],
  usage: "erkek [üye] [isim] [yaş]",
  description: "Belirtilen üyeyi erkek olarak kaydeder."
};