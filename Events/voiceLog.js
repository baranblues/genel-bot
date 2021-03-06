const {MessageEmbed, WebhookClient}= require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = require("../veriler.json");
const client = global.client;
const webhook = new WebhookClient("804276047574073364", "lHBo58zLeN7SD2IrKkBhKpzO5Itbc_9qE-MNZhSM_UcRxiiS-nu6CsFVFxWJjb4j_4Z7")

module.exports = (oldState, newState) => {
  //let ayar = db.get('ayar') || {};
  if (ayar.sesLogKanali && client.channels.cache.has(ayar.sesLogKanali)) {
    let logKanali = client.channels.cache.get(ayar.sesLogKanali);
    if (!oldState.channelID && newState.channelID) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanala **katıldı!**`).catch();
    if (oldState.channelID && !newState.channelID) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi \`${newState.guild.channels.cache.get(oldState.channelID).name}\` adlı sesli kanaldan **ayrıldı!**`).catch();
    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi ses kanalını **değiştirdi!** (\`${newState.guild.channels.cache.get(oldState.channelID).name}\` => \`${newState.guild.channels.cache.get(newState.channelID).name}\`)`).catch();
    if (oldState.channelID && oldState.selfMute && !newState.selfMute) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendi susturmasını **kaldırdı!**`).catch();
    if (oldState.channelID && !oldState.selfMute && newState.selfMute) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendini **susturdu!**`).catch();
    if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`).catch();
    if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) return webhook.send(`\`${newState.guild.members.cache.get(newState.id).displayName}\` üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendini **sağırlaştırdı!**`).catch();
  };
}

module.exports.configuration = {
  name: "voiceStateUpdate"
}