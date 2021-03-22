const { MessageEmbed, Discord } = require("discord.js");
const conf = require('../ayarlar.json');
const qdb =require("quick.db");
const db = new qdb.table("kullanici");
const ayar = require("../veriler.json");
module.exports.execute = async (client, message, args, emoji) => {
    let embed = new MessageEmbed().setTimestamp();
    if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Temp Mute komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
    message.react(client.emojiler.iptal);
    if(!message.member.voice.channel)return message.channel.send(embed.setDescription(`:x: Bir ses kanalında **bulunmuyorsun!**`)).then(x => x.delete({timeout: 10000}));
    let kanal = message.member.voice.channel.id
    if(!kanal) return message.channel.send(embed.setDescription(`:x: Bir ses kanalında **bulunmuyorsun!**`))
    if(!message.guild.channels.cache.get(kanal).members.array().filter(x => x.id !== message.member.id).size <= 0) return message.channel.send(embed.setDescription(`:x: Bulunduğun kanalda senden başkası **bulunmuyor!**`)).catch(e => { })

    let firstChannelMembers = message.guild.channels.cache.get(kanal).members.array().filter(x => x.id !== message.member.id);

    firstChannelMembers.forEach((x, i) => {
    setTimeout(async () => {
        x.voice.setMute(false)
    }, i*200)
    })
   
  message.channel.send(embed.setDescription(`**${message.guild.channels.cache.get(kanal).name}** Adlı kanaldaki \`${firstChannelMembers.length}\` üyelerin susturulmasını kaldırdım!`)).catch(e => { })
  message.react(client.emojiler.onay)
};
module.exports.configuration = {
    name: "allunmute",
    aliases: [],
    usage: "allunmute",
    description: "Ses kanalındaki herkesi susturmasını kaldırır."
};
