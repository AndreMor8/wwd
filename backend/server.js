//read .env file
require("dotenv").config({ path: __dirname + "/.env" });

//Dependencies
const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const csrf = require('csurf');
const session = require("express-session");
const MongoStore = require("connect-mongo");

//Full express app
const app = express();
(async () => {
  //Connect to database
  await mongoose.connect(process.env.MDB_PATH);
  //Discord strategy
  require("./strategies/discord.js");
  if (process.env.SERVE_STATIC) app.use(express.static(require('path').join(__dirname, "..", "frontend", "dist")));
  app.use(express.json());
  //Using sessions
  app.use(
    session({
      secret: process.env.SECRET || "?",
      cookie: {
        maxAge: 60000 * 60 * 24
      },
      saveUninitialized: false,
      resave: false,
      name: "discord.oauth2",
      store: MongoStore.create({ client: mongoose.connection.getClient() })
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  //Ignoring PUT requests as I'm using them with Authorization keys
  app.use(csrf({ ignoreMethods: ['GET', 'PUT', 'HEAD', 'OPTIONS'] }));
  //Use api route, simple as `reverse_proxy localhost:port` on Caddy
  app.use("/api", require("./routes/main"));
  //No unauthorized logged-on requests
  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    res.status(403).send({ message: "form tampered with", status: 403 })
  });
  //Error handler
  app.use(function (err, req, res, next) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: `Something happened: ${err}`, status: 500 });
    } else next();
  });
  //All requests handler
  app.use("*", function (req, res) {
    //A 405 for non-GET requests
    if (req.method !== "GET") res.status(405).json({ status: 405, message: "Method not allowed!" });
    // If self-serving static front-end pages, return index.html, otherwise just redirect
    else if (process.env.SERVE_STATIC) {
      res.sendFile(require("path").join(__dirname, "..", "frontend", "dist", "index.html"));
    } else res.status(404).redirect('/');
  });
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
})().catch(err => {
  console.error(err);
  process.exit(1);
});
