const router = require('express').Router();

const utils = require('../utils/utils');
const { MessageEmbed, Util, Permissions } = require('discord.js');

const DiscordUser = require("../models/DiscordUser");
const bans = require("../models/appeals");
const birthday = require("../models/birthday");
const birthdayYears = require("../models/birthday-years");
const wmposts = require("../models/wm-post.js");

const auth = require("./auth.js");
router.use("/auth", auth);

function isLogged(req, res, next) {
  if (req.user) next();
  else res.status(401).json({ message: "You must login with Discord on this website first.", status: 401 });
}

function getWWDMember(user) {
  if (!user) return undefined;
  return utils.getMember("402555684849451028", user.discordId);
}

async function WWDPerms(member) {
  if (!member) return new Permissions(0n);
  const data = await utils.getWWDPerms(member.user.id);
  if (data.status !== 200) return new Permissions(0n);
  else return new Permissions(BigInt(data.member.permissions));
}

async function canGoWubbzyMedia(user) {
  const obj = { view: false, publish: false, admin: false };
  //check if user is on wwd
  const onGuild = await getWWDMember(user)?.catch(() => { });
  if (!onGuild) return obj;
  //check if has wubbzy-media publisher role
  const hasRole = onGuild.roles.includes("691449767007617104");
  if (hasRole) {
    obj.view = true;
    obj.publish = true;
  }
  //check if user has perms to attach files (in wwd means they're verified)
  const perms = await WWDPerms(onGuild);
  if (perms.has("ATTACH_FILES")) obj.view = true;
  //admin can modify anything
  if (perms.has("ADMINISTRATOR")) {
    obj.view = true;
    obj.publish = true;
    obj.admin = true;
  }
  return obj;
}

router.get('/', (req, res) => {
  res.status(200).json({ status: 200, message: "Hello world!" });
});

router.get('/user', async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), { domain: process.env.COOKIE_DOMAIN });
  const member = await getWWDMember(req?.user)?.catch(() => { });
  const perms = await WWDPerms(member);
  res.status(200).json({
    user: {
      tag: req.user ? req.user.username : "stranger",
      id: req.user ? req.user.discordId : null,
      inserver: !!member,
      verified: perms.has("ATTACH_FILES"),
      admin: perms.has("ADMINISTRATOR")
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
    for (const i in docs) {
      if (!docs[i].userID || docs[i].anon) {
        docs[i].userID = null;
        docs[i].username = "Anonymous";
        docs[i].avatar = null;
        continue;
      }
      const user = await DiscordUser.findOne({ discordId: docs[i].userID }).lean();
      if (user) {
        docs[i].username = user.username;
        docs[i].avatar = utils.getAvatar(user);
      } else {
        docs[i].username = "Unknown User";
        docs[i].avatar = null;
      }
    }
    res.status(200).json({ enabled: yearObj.enabled, cards: docs });
  } catch (err) {
    res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
  }
});

router.get("/appeal", isLogged, async (req, res) => {
  const esto = await utils.getGuildBan("402555684849451028", req.user.discordId).catch(() => { });
  const appeal = await bans.findOne({ guildId: "402555684849451028", userId: req.user.discordId }).lean();
  res.status(200).json({ userID: req.user.discordId, banned: !!esto, reason: esto?.reason || null, appealed: !!appeal });
});

router.post("/appeal", isLogged, async (req, res) => {
  if (!req.body.reason) return res.status(400).json({ message: "You have not put the reason", status: 400 });
  if (req.body.reason.length > 2000) return res.status(400).json({ message: "reason must be up to 2000 characters", status: 400 });
  if (req.body.additional?.length > 1000) return res.status(400).json({ message: "additional must be up to 1000 characters", status: 400 });
  const esto = await utils.getGuildBan("402555684849451028", req.user.discordId).catch(() => { });
  if (!esto) return res.status(403).json({ message: "You're not banned", status: 403 });
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
      embeds: [new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("New ban appeal")
        .setDescription(req.body.reason)
        .addField("Additional", req.body.additional || "*No additional*")
        .setAuthor({ name: `${req.user.username} (${req.user.discordId})`, iconURL: utils.getAvatar(req.user) })]
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

    const embed = new MessageEmbed()
      .setTitle("New Wubbzy Birthday Card")
      .setAuthor(req.user.username, utils.getAvatar(req.user))
      .setDescription(Util.splitMessage(doc.card, { maxLength: 4096 })[0] || "?")
      .addField("Requested anonymity?", doc.anon ? "Yes" : "No")
      .setTimestamp();
    if (doc.additional) {
      embed.addField("Additional", Util.splitMessage(doc.additional, { maxLength: 1024 })[0]);
    }

    await utils.createMessage("746852433644224562", {
      embeds: [embed],
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
    res.status(201).json({ status: 201, message: "Card created." });
  } catch (err) {
    res.status(500).json({ message: `${err}`, status: 500 });
  }
});

router.put("/birthday-cards/:docId/publish", async (req, res) => {
  if (req.headers['authorization'] !== process.env.VERYS) return res.status(403).json({ status: 403, message: "Header 'Authorization' has an incorrect key." });

  const doc = await birthday.findByIdAndUpdate(req.params.docId, { $set: { published: true } }).lean();
  if (doc) {
    const user = await DiscordUser.findOne({ discordId: doc.userID }).lean();
    const embed = new MessageEmbed()
      .setTitle("New Wubbzy birthday card <:WubbzyParty:608094605296271382>")
      .setDescription(Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
      .setColor("RANDOM");
    if (doc.anon) embed.setAuthor("Anonymous");
    else embed.setAuthor(user.username, utils.getAvatar(user));
    if (doc.additional) embed.addField("Additional", Util.splitMessage(doc.additional, { maxLength: 1024 })[0] || "?");

    await utils.createMessage("746852649248227328", { embeds: [embed] });
    return res.status(201).json({ status: 201 });
  }
  else return res.status(404).json({ status: 404, message: "Card not found" });
});


const text = `Your birthday card has been rejected.

Make sure that:
-> The content has a decent spelling.
-> The content does not contain profanity or NSFW.
-> The content does not contain spam.
-> That does not have content copied from other websites. You must be creative.

You can try again, good luck =D`;

router.put("/birthday-cards/:docId/reject", async (req, res) => {
  if (req.headers['authorization'] !== process.env.VERYS) return res.status(403).json({ status: 403, message: "Header 'Authorization' has an incorrect key." });

  const doc = await birthday.findByIdAndDelete(req.params.docId).lean();
  if (doc) {
    try {
      const channel = await utils.createDM(doc.userID);
      await utils.createMessage(channel.id, { content: text });
    } catch (_) {
      await utils.createMessage("402555684849451030", { content: `<@!${doc.userID}>, ${text}` }).catch(() => { });
    } finally {
      res.status(201).json({ status: 201 });
    }
  }
  else return res.status(404).json({ status: 404, message: "Card not found" });
});

router.get("/wm/posts", isLogged, async (req, res) => {
  const wmui = await canGoWubbzyMedia(req.user);
  const posts = wmui.view ? await wmposts.find().lean() : [];
  return res.status(200).json({ wmui, posts });
});

router.get("/wm/posts/:id", isLogged, async (req, res) => {
  const wmui = await canGoWubbzyMedia(req.user);
  if (req.params.id === "check") return res.status(200).json({ wmui });
  if (!wmui.view) return res.status(403).json({ status: 403, message: "You must be verified on Wow Wow Discord to view this content." });
  const post = await wmposts.findById(req.params.id).lean().catch(() => { });
  if (post) {
    for (const i in post.mirrors) {
      delete post.mirrors[i]._id;
    }
    return res.status(200).json({ wmui, post });
  }
  else return res.status(404).json({ status: 404, message: "Document not found." });
});

async function checkPost(req, res, next) {
  req.wmui = await canGoWubbzyMedia(req.user);
  if (typeof req.body.title !== "string") return res.status(400).json({ status: 400, message: "You need a title for your post." });
  if (req.body.title.length > 200) return res.status(400).json({ status: 400, message: "Only up to 200 characters are allowed in the title description." });
  if (typeof req.body.description !== "string") return res.status(400).json({ status: 400, message: "You need a description for your post." });
  if (req.body.description.length > 2500) return res.status(400).json({ status: 400, message: "Only up to 2500 characters are allowed in the post description." })
  if (!Array.isArray(req.body.mirrors)) return res.status(400).json({ status: 400, message: "You need at least 1 mirror for your post." });
  if (!req.body.mirrors.length) return res.status(400).json({ status: 400, message: "You need at least 1 mirror for your post." });
  if (typeof req.body.type !== "number") return res.status(400).json({ status: 400, message: "You need to choose 1 valid type for your post." });
  if (!([0, 1, 2, 3].includes(req.body.type))) return res.status(400).json({ status: 400, message: "You need to choose 1 valid type for your post." });
  for (const i in req.body.mirrors) {
    if (i > 10) return res.status(400).json({ status: 400, message: "You can only put up to 10 mirrors per post." });
    if (typeof req.body.mirrors[i].name !== "string") return res.status(400).json({ status: 400, message: "You need a name for your post." });
    if (req.body.mirrors[i].name.length > 50) return res.status(400).json({ status: 400, message: "Only up to 50 characters are allowed in the mirror title." });
    if (typeof req.body.mirrors[i].url !== "string") return res.status(400).json({ status: 400, message: "You need a valid HTTP* URL for your post." });
    try {
      const info = new URL(req.body.mirrors[i].url);
      if (!(["http:", "https:"].includes(info.protocol))) return res.status(400).json({ status: 400, message: "You need a valid HTTP* URL for your post." });
    } catch (err) {
      return res.status(400).json({ status: 400, message: "You need a valid HTTP* URL for your post." });
    }
    if (!Object.keys(req.body.mirrors[i]).every(e => ["name", "url"].includes(e))) return res.status(400).json({ status: 400, message: "No other keys are allowed on the mirror object." });
  }
  next();
}

router.post("/wm/posts", isLogged, checkPost, async (req, res) => {
  if (!req.wmui.publish) return res.status(403).json({ status: 403, message: "You need the 'Wubbzy-Media Publisher' role on Wow Wow Discord to post new content here." });
  await wmposts.create({
    userID: req.user.discordId,
    title: req.body.title,
    description: req.body.description,
    mirrors: req.body.mirrors,
    type: req.body.type
  });
  res.status(201).json({ status: 201, message: "Post created." });
});

router.put("/wm/posts/:id", isLogged, checkPost, async (req, res) => {
  if (!req.wmui.view) return res.status(403).json({ status: 403, message: "You must be verified on Wow Wow Discord to view this content." });
  const doc = await wmposts.findById(req.params.id).catch(() => { });
  if (!doc) return res.status(404).json({ status: 404, message: "Document not found." });
  if ((doc.userID !== req.user.discordId) && (!req.wmui.admin)) return res.status(403).json({ status: 403, message: "You cannot edit a post that is not yours." });
  await doc.updateOne({ title: req.body.title, description: req.body.description, mirrors: req.body.mirrors, type: req.body.type }, { new: true });
  return res.status(200).json({ status: 200, message: "Post edited." });
});

router.delete("/wm/posts/:id", isLogged, async (req, res) => {
  const wmui = await canGoWubbzyMedia(req.user);
  if (!wmui.view) return res.status(403).json({ status: 403, message: "You must be verified on Wow Wow Discord to view this content." });
  const doc = await wmposts.findByIdAndDelete(req.params.id).catch(() => { });
  if (!doc) return res.status(404).json({ status: 404, message: "Document not found." });
  if ((doc.userID !== req.user.discordId) && (!wmui.admin)) return res.status(403).json({ status: 403, message: "You must be an admin on Wow Wow Discord to delete posts." });
  return res.status(200).json({ status: 200, message: "Post deleted." });
});

module.exports = router;