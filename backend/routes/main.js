const router = require('express').Router();
const { getPermissions } = require('../utils/utils');
const Discord = require("discord.js");
const DiscordUser = require("../models/DiscordUser");
const bans = require("../models/appeals");
const utils = require('../utils/utils');
const birthday = require("../models/birthday");
const birthdayYears = require("../models/birthday-years");
const auth = require("./auth.js");
const e = require('express');

router.use("/auth", auth);

router.use(async function (req, res, next) {
  if (req.user) {
    const guilds = await utils.getUserGuilds(req.user.discordId) || [];
    req.user.guilds = guilds;
  }
  next();
});

function isLogged(req, res, next) {
  if (req.user) next();
  else res.status(401).json({ message: "You must login to the page first", status: 401 });
};

function isInWDD(req, res, next) {
  const wwd = req.user.guilds.find(e => e.id === "402555684849451028");
  if (wwd) next();
  else res.status(403).json({ message: "You must be on the Wow Wow Discord server before viewing this category.", status: 403 });
}

function isWWDAdmin(req, res, next) {
  const guild = req.user.guilds.find(e => e.id === "402555684849451028")
  const permissions = utils.getPermissions(guild.permissions);
  if (!permissions.get("ADMINISTRATOR")) return res.status(403).json({ message: "You must be an administrator of Wow Wow Discord to view this page.", status: 403 });
  next();
}

function isWWDVerified(req, res, next) {
  const guild = req.user.guilds.find(e => e.id === "402555684849451028")
  const permissions = utils.getPermissions(guild.permissions);
  if (!permissions.get("ATTACH_FILES")) return res.status(403).json({ message: "You must be a verified user of Wow Wow Discord to view this page.", status: 403 });
  next();
}

router.get('/user', async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.status(200).json({
    hello: "world",
    user: {
      tag: req.user ? req.user.username : "stranger",
      id: req.user ? req.user.discordId : null,
      inserver: req.user ? (req.user.guilds.find(e => e.id === "402555684849451028") ? true : false) : false,

      verified: req.user ? ((req.user.guilds.find(e => e.id === "402555684849451028")) ? (getPermissions(req.user.guilds.find(e => e.id === "402555684849451028").permissions).has("ATTACH_FILES")) : (false)) : false,
      admin: req.user ? ((req.user.guilds.find(e => e.id === "402555684849451028")) ? (getPermissions(req.user.guilds.find(e => e.id === "402555684849451028").permissions).has("ADMINISTRATOR")) : (false)) : false
    },
    logged: req.user ? true : false,
  });
});

router.get("/birthday-cards", async (req, res) => {
  const years = await birthdayYears.find().lean();
  res.status(200).json(years);
});

router.get("/birthday-cards/checkcard", isLogged, async (req, res) => {
  const year = await birthdayYears.findOne({ enabled: true }).lean();
  if (year) {
    const user = await birthday.findOne({ year: year.year, userID: req.user.discordId }).lean();
    res.status(200).json({ status: 200, sended: !!(user), enabled: true });
  } else res.status(200).json({ status: 200, sended: false, enabled: false });
});

router.get("/birthday-cards/:year", async (req, res) => {
  if (req.params.year.length > 4) return res.status(400).send("Invalid year!");
  try {
    const year = Number(req.params.year);
    if (!year) return res.status(400).json({ message: "Invalid year!", status: 400 });
    const yearObj = await birthdayYears.findOne({ year }).lean();
    if (!yearObj) return res.status(404).json({ message: "Year not found!", status: 404 });
    const docs = await birthday.find({ published: true, year }).lean();
    const tosend = [];
    for (let i in docs) {
      const tosend_obj = {};
      tosend_obj.anon = docs[i].anon;
      tosend_obj._id = docs[i]._id;
      tosend_obj.card = docs[i].card;
      tosend_obj.additional = docs[i].additional;
      tosend_obj.userID = docs[i].userID;
      if (!docs[i].userID || docs[i].anon) {
        tosend_obj.userID = null;
        tosend_obj.username = "Anonymous";
        tosend_obj.avatar = null;
        tosend.push(tosend_obj);
        continue;
      };
      const user = await DiscordUser.findOne({ discordId: docs[i].userID }).lean();
      if (user) {
        tosend_obj.username = user.username;
        tosend_obj.avatar = utils.getAvatar(user);
      } else {
        tosend_obj.username = "Unknown User";
        tosend_obj.avatar = null;
      }
      tosend.push(tosend_obj);
    }
    res.status(200).json({ enabled: yearObj.enabled, cards: tosend });
  } catch (err) {
    res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
  }
});

router.get("/appeal", isLogged, async (req, res) => {
  const esto = await utils.getGuildBans("402555684849451028");
  const ver = esto.find(e => e.user.id === req.user.discordId);
  const appeal = await bans.findOne({ guildId: "402555684849451028", userId: req.user.discordId }).lean();
  res.status(200).json({ userID: req.user.discordId, banned: !!ver, reason: ver?.reason || null, appealed: !!appeal });
});

router.post("/appeal", isLogged, async (req, res) => {
  if (!req.body.reason) return res.status(400).json({ message: "You have not put the reason", status: 400 });
  if (req.body.reason.length > 2000) return res.status(400).json({ message: "reason must be up to 2000 characters", status: 400 });
  if (req.body.additional?.length > 1000) return res.status(400).json({ message: "additional must be up to 1000 characters", status: 400 });
  const esto = await utils.getGuildBans("402555684849451028");
  const ver = esto.find(e => e.user.id === req.user.discordId);
  if (!ver) return res.status(403).json({ message: "You're not banned", status: 403 });
  try {
    const algo = await bans.findOne({ guildId: "402555684849451028", userId: req.user.discordId }).lean();
    if (algo) return res.status(403).json({ message: "You already submitted your appeal", status: 403 });
    await bans.create({
      guildId: "402555684849451028",
      userId: req.user.discordId,
      reason: req.body.reason,
      additional: req.body.additional || "*No additional*"
    });
    await utils.createMessage("713899475059343440", {
      embed: new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("New ban appeal")
        .setDescription(req.body.reason)
        .addField("Additional", req.body.additional || "*No additional*")
        .setAuthor(`${req.user.username} (${req.user.discordId})`, utils.getAvatar(req.user))
    });
    res.status(201).json({ status: 201 });
  } catch (err) {
    res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
  }
});

router.post("/birthday-cards/submit", isLogged, async (req, res) => {
  if (!req.body.card) return res.status(400).json({ message: "You must write the letter!", status: 400 });
  try {
    const year = await birthdayYears.findOne({ enabled: true }).lean();
    if (!year) return res.status(403).json({ message: "There is no enabled year where you can send cards.", status: 403 });
    const algo = await birthday.findOne({ year: year.year, userID: req.user.discordId }).lean();
    if (algo) return res.status(403).json({ message: "You already submitted your birthday card", status: 403 });
    const doc = await birthday.create({
      userID: req.user.discordId,
      card: req.body.card,
      additional: req.body.additional,
      anon: req.body.anon ? true : false,
      published: false,
      year: year.year
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy Birthday Card")
      .setAuthor(req.user.username, utils.getAvatar(req.user))
      .setDescription(Discord.Util.splitMessage(doc.card, { maxLength: 4096 })[0] || "?")
      .addField("Requested anonymity?", doc.anon ? "Yes" : "No")
      .setTimestamp();
    if (doc.additional) {
      embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1024 })[0]);
    }

    await utils.createMessage("746852433644224562", {
      embed,
      components: [{
        type: 1,
        components: [{
          type: 2,
          label: "Publish",
          style: 3,
          custom_id: `ww_hb_publish_${doc._id}`
        },
        {
          type: 2,
          label: "Reject",
          style: 4,
          custom_id: `ww_hb_reject_${doc._id}`
        }]
      }]
    });
    res.status(201).json({ status: 201 });
  } catch (err) {
    res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
  }
});

router.put("/birthday-cards/:docId/publish", async (req, res) => {
  if (req.headers['authorization'] !== process.env.VERYS) return res.status(403).json({ status: 403, message: "Header 'Authorization' has an incorrect key." });

  const doc = await birthday.findByIdAndUpdate(req.params.docId, { $set: { published: true } }).lean();
  if (doc) {
    const user = await DiscordUser.findOne({ discordId: doc.userID }).lean();
    const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy birthday card <:WubbzyParty:608094605296271382>")
      .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
      .setColor("RANDOM");
    if (doc.anon) embed.setAuthor("Anonymous");
    else embed.setAuthor(user.username, utils.getAvatar(user));
    if (doc.additional) embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1024 })[0] || "?");

    await utils.createMessage("746852649248227328", { embed });
    return res.status(201).json({ status: 201 });
  }
  else return res.status(404).json({ status: 404, message: "Card not found" });
});

router.put("/birthday-cards/:docId/reject", async (req, res) => {
  if (req.headers['authorization'] !== process.env.VERYS) return res.status(403).json({ status: 403, message: "Header 'Authorization' has an incorrect key." });

  const doc = await birthday.findByIdAndDelete(req.params.docId).lean();
  if (doc) return res.status(201).json({ status: 201 });
  else return res.status(404).json({ status: 404, message: "Card not found" });
});

module.exports = router;