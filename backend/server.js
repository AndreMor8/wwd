require("dotenv").config({ path: __dirname + "/.env" });
const db = require("./database.js");
const express = require("express");
const passport = require("passport");
const csrf = require('csurf');
(async () => {
  const app = express();
  await db();
  const session = require("express-session");
  const MongoStore = require("connect-mongo")(session);
  require("./strategies/discord.js");
  if (process.env.SERVE_STATIC) app.use(express.static(__dirname + "../public"));
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SECRET || "?",
      cookie: {
        maxAge: 60000 * 60 * 24
      },
      saveUninitialized: false,
      resave: false,
      name: "discord.oauth2",
      store: new MongoStore({ mongooseConnection: require("mongoose").connection })
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(csrf());
  app.use("/api", require("./routes/main"));

  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    res.status(403).send({ message: "form tampered with", status: 403 })
  })
  app.use(function (err, req, res, next) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
    } else next();
  });
  app.use("*", function (req, res) {
    if (req.method !== "GET") res.status(405).json({ status: 405, message: "Method not allowed!" });
    else if (process.env.SERVE_STATIC) {
      res.sendFile(require("path").join(__dirname, "..", "public", "index.html"));
    } else res.status(404).json({ status: 404, message: "Not found" });
  });
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
})().catch(err => {
  console.log(err);
  process.exit(1);
});
