
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
//const ayar = db.get('ayar') || {};
const ayar = require("../veriler.json");
const client = global.client;
module.exports = () => {
  console.log("Bot aktif!");
  client.user.setActivity("Abey!");
  if (ayar.botSesKanali && client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
}
module.exports.configuration = {
  name: "ready"
}