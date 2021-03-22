const { MessageEmbed } = require("discord.js");
const ayar = require("../veriler.json");

module.exports.execute = async(client, message, args, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Abey").setColor(client.randomColor()).setTimestamp();
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!")).then(x => x.delete({timeout: 5000}));
  if(!args[0]) return message.channel.send(embed.setDescription("Bota yazdırılacak metni belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  message.delete({timeout: 100});
  message.channel.send(args.join(' '));
};
module.exports.configuration = {
    name: "yaz",
    aliases: ["type", 'say'],
    usage: "yaz [metin]",
    description: "Belirtilen mesajı bota gönderir."
};