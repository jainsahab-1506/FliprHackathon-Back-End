const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const { userSchema, tokenSchema } = require("./model");

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
tokenSchema.plugin(passportLocalMongoose);
tokenSchema.plugin(findOrCreate);

const Token = new mongoose.model("Token", tokenSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
var userprofile;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile.emails);
      var newUserName = profile.name.givenName + profile.id;

      User.findOrCreate(
        {
          googleId: profile.id,
          username: newUserName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
        },
        function (err, user) {
          const data = new Token({
            userid: user._id,
            token: accessToken,
          });
          data.save();

          return cb(err, user);
        }
      );
    }
  )
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: "/",
  }),
  function (req, res) {
    res.send(userprofile);

    // Successful authentication, redirect to secrets.
  }
);
module.exports = router;
