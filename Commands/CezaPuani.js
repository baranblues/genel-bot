const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const pudb = new qdb.table("cezapuani");
const db = new qdb.table("ayarlar");
const conf = require('../ayarlar.json');
const ayar = require("../veriler.json");

module.exports.execute = async(client, message, args, emoji) => {
    let embed = new MessageEmbed().setColor("RANDOM").setTimestamp();
    const filter = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id === message.author.id; 
    };

    let uye = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let cpuan = pudb.get(`cezapuan.${uye.id}.${message.guild.id}`);

    let durum;
    if (cpuan >= 50) durum = "Tehlikeli";
    if (cpuan < 50) durum = "Güvenli";
    if (cpuan == null || cpuan == undefined) durum = "Analiz Edilemedi";

    message.channel.send(embed.setDescription(`${uye} adlı üyenin toplam ${cpuan || '0'} adet ceza puanı mevcut (\`${durum}\`)`).setFooter(`Daha detaylı bilgi için 10 saniye içerisinde emojiye tıklayabilirsin.`)).then(x => {
        x.react("✅");
        x.awaitReactions(filter, {max: 1, time: 10000, error: ['time']}).then(z => {
            let donut = z.first();
            if (donut) {
                x.edit(embed.setDescription(`${uye} adlı üyenin toplam ${cpuan || '0'} adet ceza puanı mevcut. Durumu: \`${durum}\``));
            };
        });
    });
};
module.exports.configuration = {
    name: "cezapuani",
    aliases: [],
    usage: "Cezapuani @etiket",
    description: "Etiketlediğiniz Kişinin Ceza Puanını Gösterir."
};