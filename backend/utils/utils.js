//OAuth2 bearer token
const OAuth2 = require("../models/OAuth2Credentials");
const CryptoJS = require("crypto-js");
//Bot client
const { SnowTransfer } = require('snowtransfer');
const botClient = new SnowTransfer(`Bot ${process.env.DISCORD_TOKEN}`, { disableEveryone: true });

module.exports = {
  getUser: async function (userId) {
    const res = await botClient.user.getUser(userId);
    return res;
  },
  getMember: async function (guildID, userID) {
    return await botClient.guild.getGuildMember(guildID, userID);
  },
  getWWDPerms: async function (userID) {
    const res = await fetch(`${process.env.NEW_API}?id=${userID}`, { headers: { Authorization: process.env.NEW_API_PASS } });
    return await res.json();
  },
  getGuildRoles: async function (guildID) {
    return await botClient.guild.getGuildRoles(guildID);
  },
  getMemberRoles: async function (guildID, memberID) {
    const member = await this.getMember(guildID, memberID);
    const roles = await this.getGuildRoles(guildID);
    const toshow = roles.filter(e => member.roles.includes(e.id));
    return toshow;
  },
  getGuildBan: function (guildID, memberID) {
    return botClient.guild.getGuildBan(guildID, memberID);
  },
  createMessage: async function (channelID, content) {
    return await botClient.channel.createMessage(channelID, content);
  },
  createDM: async function (recipient_id) {
    return await botClient.user.createDirectMessageChannel(recipient_id);
  },
  getAccessToken: async function (discordId) {
    const algo = await OAuth2.findOne({ discordId }).lean();
    if (!algo) throw new Error("No credentials found! Try re-login");
    return this.decrypt(algo.accessToken).toString(CryptoJS.enc.Utf8);
  },
  encrypt: function (token) {
    return CryptoJS.AES.encrypt(token, process.env.VERYS)
  },
  decrypt: function (etoken) {
    return CryptoJS.AES.decrypt(etoken, process.env.VERYS)
  },
  getAvatar: function (User) {
    if (User.avatar) {
      if (User.avatar.startsWith("a_")) return `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.gif?size=4096`
      else return `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.png?size=4096`
    } else return `https://cdn.discordapp.com/embed/avatars/${User.username.split("#")[1] % 5}.png`
  },
  // eslint-disable-next-line no-useless-escape
  urlRegex: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g
};
