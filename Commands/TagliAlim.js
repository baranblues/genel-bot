const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const config = require("../ayarlar.json");
const ayar = require("../veriler.json");

module.exports.execute = async(client, message, args,  emoji) => {
    
    let embed = new MessageEmbed().setFooter("Developed By Abey.").setColor("010000").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setTimestamp();
    
    if (!message.member.roles.cache.has(ayar.sahipRolu) && !message.member.hasPermission("ADMINISTRATOR")) return;
    
    if(!args[0]) {
    message.react(client.emojiler.iptal);
    message.channel.send(embed.setDescription(`${client.emoji("iptal")} Komutu yanlış kullandınız! ${config.prefix}taglıalım aç/kapat`))
    return;    
    }
    if (args[0] === "aç") {
    if(db.fetch(`taglıAlım.${message.guild.id}`)) return message.channel.send(embed.setDescription(`${client.emoji("iptal")} Taglı alım sistemi zaten aktif!`))
    db.set(`taglıAlım.${message.guild.id}`, "taglıAlım")
    message.channel.send(embed.setDescription(`${client.emoji("onay")} Taglı alım sistemi aktif edildi!`))
    return;    
    } else if (args[0] === "kapat") {
    if(!db.fetch(`taglıAlım.${message.guild.id}`)) return message.channel.send(embed.setDescription(`${client.emoji("iptal")} Taglı alım sistemi zaten devre dışı!`))
    db.delete(`taglıAlım.${message.guild.id}`)
    message.channel.send(embed.setDescription(`${client.emoji("onay")} Taglı alım sistemi devre dışı bırakıldı!`))
    return;    
    };
    
    };
    
module.exports.configuration = {
    name: "taglialim",
    aliases: ["taglıalım"],
    usage: ".taglıalım",
    description: "Taglı Alım Modu Açarsınız."
};