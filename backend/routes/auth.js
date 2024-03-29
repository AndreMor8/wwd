const keys = new Set();
const router = require('express').Router();
const passport = require('passport');

router.get('/', isAuthorized, (req, res, next) => {
    const key = req.csrfToken();
    if (req.query.error) {
        keys.delete(req.query.state);
        return res.redirect(302, "/");
    } else if (req.query.code) {
        if (typeof req.query.state !== "string") return res.status(400).send("No state query found. Try re-login!");
        if (!keys.has(req.query.state)) return res.status(400).send("Invalid state key! Try re-login!");
        keys.delete(req.query.state);
    } else {
        keys.add(key);
    }
    passport.authenticate('discord', {
        state: key,
        failureMessage: true,
        scope: ["identify"],
        callbackURL: `${process.env.API_DOMAIN}${process.env.CLIENT_REDIRECT}`,
        successRedirect: `${process.env.FRONTEND_DOMAIN}`
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout(err => {
            if (err) res.status(500).send(err.toString());
            else res.redirect(process.env.FRONTEND_DOMAIN);
        });
    } else {
        res.redirect(process.env.FRONTEND_DOMAIN);
    }
});

function isAuthorized(req, res, next) {
    if (req.user) {
        res.redirect(process.env.FRONTEND_DOMAIN)
    }
    else {
        next();
    }
}

module.exports = router;