const router = require('express').Router();
const { getPermissions } = require('../utils/utils');
const Discord = require("discord.js");
const DiscordUser = require("../models/DiscordUser");
const fetch = require("node-fetch");
const bans = require("../models/appeals");
const utils = require('../utils/utils');
const birthday = require("../models/birthday");
const birthdayYears = require("../models/birthday-years");
const auth = require("./auth.js");

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

///////////////////////////////////// NON-LOGGED USERS //////////////////////////////////////

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
  const years = await birthdayYears.find();
  res.status(200).json(years);
});

router.get("/birthday-cards/:year", async (req, res) => {
  if (req.params.year.length > 4) return res.status(400).send("Invalid year!");
  try {
    const year = Number(req.params.year);
    if (!year) return res.status(400).json({ message: "Invalid year!", status: 400 });
    const docs = await birthday.find({ published: true, year });
    if (!docs.length) return res.status(404).json({ message: "No cards found for the specified year", status: 404 });
    const tosend = [];
    for (let i in docs) {
      const tosend_obj = {};
      tosend_obj.anon = docs[i].anon;
      tosend_obj._id = docs[i]._id;
      tosend_obj.card = docs[i].card;
      tosend_obj.additional = docs[i].additional;
      tosend_obj.userID = docs[i].userID;
      if (!docs[i].userID) {
        tosend_obj.username = "Anonymous";
        tosend_obj.avatar = null;
        tosend.push(tosend_obj);
        continue;
      };
      const user = await DiscordUser.findOne({ discordId: docs[i].userID });
      if (user) {
        tosend_obj.username = user.username;
        tosend_obj.avatar = utils.getAvatar(user);
      } else {
        tosend_obj.username = "Unknown User";
        tosend_obj.avatar = null;
      }
      tosend.push(tosend_obj);
    }
    res.status(200).json(tosend);
  } catch (err) {
    res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
  }
});
//END
///////////////////////////////////// LOGGED USERS //////////////////////////////////////

router.get("/appeal", isLogged, async (req, res) => {
  const esto = await utils.getGuildBans("402555684849451028");
  const ver = esto.find(e => e.user.id === req.user.discordId);
  const appeal = await bans.findOne({ guildId: "402555684849451028", userId: req.user.discordId });
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
    const algo = await bans.findOne({ guildId: "402555684849451028", userId: req.user.discordId });
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

//END
///////////////////////////////////// WWD MEMBERS //////////////////////////////////////
//END
///////////////////////////////////// VERIFIED WWD MEMBERS //////////////////////////////////////
/*router.get('/wwr/submit', isLogged, isInWDD, isWWDVerified, async (req, res) => {
  const msgDocument = await wwr.findOne({ author: req.user.discordId });
  if (msgDocument) return res.status(403).render('wwrsubmit', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    status: 403,
    othercontent: ""
  });
  res.render('wwrsubmit', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    status: 200,
    othercontent: ""
  });
})

router.post('/wwr/submit', isLogged, isInWDD, isWWDVerified, async (req, res) => {
  try {
    if (req.body && req.body.title && req.body.desc) {
      if (req.body.title.length > 250) return res.status(400).render('wwrsubmit', {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 400,
        othercontent: ""
      });
      if (req.body.desc.length > 2000) return res.status(400).render('wwrsubmit', {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 400,
        othercontent: ""
      });
      const msgDocument = await wwr.findOne({ author: req.user.discordId });
      if (msgDocument) {
        return res.status(403).render('wwrsubmit', {
          username: req.user.username,
          csrfToken: req.csrfToken(),
          avatar: req.user.avatar,
          logged: true,
          status: 403,
          othercontent: ""
        });
      }
      await new wwr({
        author: req.user.discordId,
        title: req.body.title,
        description: req.body.desc,
        date: new Date(),
      }).save();
      const embed = new Discord.MessageEmbed()
        .setAuthor("New Wubbzy Wednesday idea")
        .setTitle(req.body.title)
        .setDescription(req.body.desc)
        .setColor("RANDOM")
        .addField("Author", `${req.user.username} / ${req.user.discordId} / <@${req.user.discordId}>`)
      await utils.createMessage("722902317896040551", { embed: embed });
      res.status(201).render('wwrsubmit', {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 201,
        othercontent: ""
      });
    } else res.status(400).render('wwrsubmit', {
      username: req.user.username,
      csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
      status: 400,
      othercontent: ""
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('wwrsubmit', {
      username: req.user.username,
      csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
      status: 500,
      othercontent: ""
    });
  }
});*/
//END
///////////////////////////////////// WWD ADMINS //////////////////////////////////////
/*router.get('/wwr', isLogged, isInWDD, isWWDAdmin, async (req, res) => {
  const msgDocument = await wwr.find();
  if (req.query && req.query.delete) {
    if (!msgDocument[req.query.delete]) return res.status(404).redirect("/wwr");
    else await msgDocument[req.query.delete].deleteOne();
    return res.status(200).redirect("/wwr");
  }
  const tosee = new Map();
  for (let i in msgDocument) {
    const user = await DiscordUser.findOne({ discordId: msgDocument[i].author });
    if (user) tosee.set(msgDocument[i].author, user.username + " (" + user.discordId + ")");
  }
  res.render('wwr', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    ideas: msgDocument,
    authors: tosee,
    othercontent: ""
  })
})

router.get("/appeals", isLogged, isInWDD, isWWDAdmin, async (req, res) => {
  const banss = await bans.find();

  const tosee = new Map();
  for (let i in banss) {
    const user = await DiscordUser.findOne({ discordId: banss[i].userId });
    if (user) tosee.set(banss[i].userId, user.username + " (" + user.discordId + ")");
  }
  res.status(200).json({
    appeals: banss,
    authors: tosee,
  });
})

router.delete("/appeals", isLogged, isInWDD, isWWDAdmin, async (req, res) => {
  const banss = await bans.find();
  if (req.body.userID) {
    if (!banss[req.body.userID]) return res.status(404).json({ status: 404, message: "Can't find that user appeal" });
    else {
      if (req.body.unban) {
        await fetch("https://discord.com/api/v6/guilds/402555684849451028/bans/" + banss[req.query.unban].userId, {
          method: "DELETE",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
          }
        });
      };
      await banss[req.query.unban].deleteOne();
      return res.status(200).json({ status: 200, deleted: banss[req.query.unban] });
    }
  }
})

router.get("/birthday-cards/admin", isLogged, isInWDD, isWWDAdmin, async (req, res) => {
  const docs = await birthday.find({ published: false });
  const tosee = new Map();

  for (let i in docs) {
    const user = await DiscordUser.findOne({ discordId: docs[i].userID });
    if (user) tosee.set(docs[i].userID, { username: user.username, avatar: utils.getAvatar(user), discordId: user.discordId });
  }
  res.status(200).json({
    cards: docs,
    authors: tosee
  });
})

router.post("/birthday-cards/admin", isLogged, isInWDD, isWWDAdmin, async (req, res) => {
  if (!req.body.birthdayID) return res.status(400).json({ status: 400, message: "You must put the birthday ID!" });
  const doc = await birthday.findById(req.body.birthdayID);
  if (!doc) return res.status(404).json({ message: "Can't find that birthday card", status: 404 });
  if (doc.anon) {
    await doc.updateOne({ published: true });
    const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy birthday card <:WubbzyParty:608094605296271382>")
      .setAuthor("Anonymous")
      .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
      .setColor("RANDOM");
    if (doc.additional) {
      embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1000 })[0]);
    }
    await utils.createMessage("746852649248227328", {
      embed: embed
    });
    return res.status(201).json({ status: 201 });
  } else {
    const user = await DiscordUser.findOne({ discordId: doc.userID });
    await doc.updateOne({ published: true });
    const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy birthday card <:WubbzyParty:608094605296271382>")
      .setAuthor(user.username, utils.getAvatar(user))
      .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
      .setColor("RANDOM");
    if (doc.additional) {
      embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1000 })[0] || "?");
    }
    await utils.createMessage("746852649248227328", {
      embed: embed
    });
    return res.status(201).json({ status: 201 });
  }
});

router.delete("/birthday-cards/admin", isLogged, isInWDD, isWWDAdmin, async (req, res) => {
  if (!req.body.birthdayID) return res.status(400).json({ status: 400, message: "You must put the birthday ID!" });
  const doc = await birthday.findByIdAndDelete(req.body.birthdayID);
  if (!doc) return res.status(404).json({ message: "Can't find that birthday card", status: 404 });

  return res.status(200).json({ status: 200 });

});

router.post("/birthday-cards/submit", isLogged, async (req, res) => {
  if (!req.body.card) return res.status(400).json({ message: "You must write the letter!", status: 400 });
  try {
    const algo = await birthday.findOne({ userID: req.user.discordId });
    if (algo) return res.status(403).json({ message: "You already submitted your birthday card", status: 403 });
    const doc = await birthday.create({
      userID: req.user.discordId,
      card: req.body.card,
      additional: req.body.additional,
      anon: req.body.anon ? true : false,
      published: false,
      year: new Date().getFullYear()
    });
    const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy Birthday Card")
      .setAuthor(req.user.username, utils.getAvatar(req.user))
      .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
    if (doc.additional) {
      embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1000 })[0]);
    }
    embed.addField("Requested anonymity?", doc.anon ? "Yes" : "No")
      .addField("URL", "https://gidgetbot.herokuapp.com/birthday-cards/admin")

    await utils.createMessage("746852433644224562", {
      embed: embed
    })
    res.status(201).json({ status: 201 });
  } catch (err) {
    res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
  }
})
*/
module.exports = router;