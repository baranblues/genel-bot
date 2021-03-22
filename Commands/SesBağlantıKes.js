const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const conf = require('../ayarlar.json');
const ayar = require("../veriler.json");

module.exports.execute = async(client, message, args, emoji) => {
let embed = new MessageEmbed().setColor("RANDOM");
if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Ses Mute komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(uye.voice.channel) uye.voice.kick().catch();
message.channel.send(embed.setDescription(`${uye} Kişisinin sesli bağlantısı başarıyla kesildi!`)).then(x => x.delete({timeout: 9000}));
};
module.exports.configuration = {
    name: "seskes",
    aliases: ["sk","sbk"],
    usage: ".seskes <id>",
    description: "Belirli kişinin ses bağlantısını keser."
};