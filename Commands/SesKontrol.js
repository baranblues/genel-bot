const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = require("../veriler.json");

// module.exports.onLoad = (client) => {}
module.exports.execute = (client, message, args,  emoji) => {
    if(![ayar.sahipRolu].some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
    return message.channel.send(new MessageEmbed().setDescription(`${message.author} Komutu kullanmak için yetkin bulunmamakta.`).setColor('0x800d0d').setAuthor(message.member.displayName, message.author.avatarURL()({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));
    
    let abey;
    let abey1 = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    let abey2 = message.guild.members.cache.get(args[0]);
    if(!phentos1) return message.channel.send(new MessageEmbed().setTimestamp().setColor('RANDOM').setDescription(`Bir ID Girmelisin Veya Kullanıcı Etiketlemelisin`)).then(x => x.delete({timeout: 5000}));
    if (abey1) {
    abey = abey1;
    }
    if (abey2) {
    abey = abey2;
    }
    if (!abey) {
    abey = message.member;
    }
    let ses = abey.voice.channel;
    if (!ses) {
    message.channel.send(new MessageEmbed().setColor('RANDOM').setDescription("**<@"+abey.id+"> Bir Sesli Kanalda Değil!**"));
    }
    if (ses) {
    let selfM = abey.voice.selfMute ? "Kapalı" : "Açık";
    let selfD = abey.voice.selfDeaf ? "Kapalı" : "Açık";
    message.channel.send(new MessageEmbed().setColor('RANDOM').setDescription(
    "**<@"+abey.id+"> İsimli Kişi `"+ses.name+"` İsimli Kanalda!**"
    )
    .addField(`Mikrofonu`,`${selfM}`, true)
    .addField(`Kulaklığı`,`${selfD}`,true));
    }};
module.exports.configuration = {
    name: "ses",
    aliases: ["seskontrol"],
    usage: "ses",
    description: "Kullanıcının seste olup olmadığını kontrol edersiniz."
};