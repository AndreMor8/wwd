//perm thing
const permissions = require("./permissions");

//OAuth2 bearer token
const OAuth2 = require("../models/OAuth2Credentials");
const CryptoJS = require("crypto-js");

//Bot client
const { SnowTransfer } = require('snowtransfer');
const botClient = new SnowTransfer(process.env.DISCORD_TOKEN, { disableEveryone: true });

//A simple caching system and that's all
const cache = new Map();
setInterval(() => {
  cache.clear();
}, 240000);

module.exports = {
  getUser: async function (userId) {
    const algo = cache.get(`user-${userId}`);
    if (algo) return algo;
    const res = await botClient.user.getUser(userId);
    cache.set(`user-${userId}`, res);
    return res;
  },
  getPermissions: function (perm) {
    const permissionMap = new Map();
    for (const [key, value] of Object.entries(permissions)) {
      if ((perm & value) == value) permissionMap.set(key, value);
    }
    return permissionMap;
  },
  getGuilds: function (botGuilds, userGuilds) {
    if (!Array.isArray(botGuilds)) {
      console.error(botGuilds);
      throw new Error('"botGuilds" is not an Array');
    }
    if (!Array.isArray(userGuilds)) {
      console.error(userGuilds);
      throw new Error('"userGuilds" is not an Array');
    }
    const guildMemberPermissions = new Map();
    userGuilds.forEach(guild => {
      const perm = this.getPermissions(guild.permissions);
      guildMemberPermissions.set(guild.id, perm);
    });
    const toshow = userGuilds.filter(e => {
      if (!botGuilds.map(r => r.id).includes(e.id)) return;
      const p = guildMemberPermissions.get(e.id);
      if (p && p.get("ADMINISTRATOR")) return true;
      else return false;
    });
    return toshow;
  },
  getUserGuilds: async function (discordId) {
    const esto = cache.get(`userGuilds-${discordId}`);
    if (esto) return esto;
    //Edit snowtransfer/dist/SnowTransfer.js to accept Bearer tokens. Works out-to-the-box
    const res = await (new SnowTransfer(`Bearer ${await this.getAccessToken(discordId)}`).user.getGuilds());
    cache.set(`userGuilds-${discordId}`, res);
    return res;
  },
  getMember: async function (guildID, userID) {
    return await botClient.guild.getGuildMember(guildID, userID);
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
  getGuildBans: async function (guildID) {
    return await botClient.guild.getGuildBans(guildID);
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
  urlRegex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/gm
};
