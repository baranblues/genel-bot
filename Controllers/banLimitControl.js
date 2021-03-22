const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const pudb = new qdb.table("puanlar");
const kdb = new qdb.table("kullanici");
const limit = new qdb.table("limitler");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkBanLimits();
    }, 1000*60*30);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkBanLimits() {
    limit.delete("limitler");
  };