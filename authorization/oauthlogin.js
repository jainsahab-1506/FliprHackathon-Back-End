const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const { userSchema, tokenSchema } = require("../model");

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

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
var userprofile, authtoken;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      var newUserName = profile.name.givenName + profile.id;
      authtoken = accessToken;
      User.findOrCreate(
        {
          googleId: profile.id,
          username: newUserName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password: "",
          verified: false,
        },
        function (err, user) {
          userprofile = user;

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
    var tokendata = new Token({
      token: authtoken,
      userid: userprofile._id,
    });

    tokendata.save(function (err, auth) {
      if (err) {
        console.log(userprofile._id);
        Token.findOne({ userid: userprofile._id }, function (error, resp) {
          console.log(resp);
          if (resp) {
            return res.status(400).json({ error: "User Already Logged In " });
          } else {
            return res.status(400).json({ error: "Internal Server Error " });
          }
        });
      } else {
        return res
          .status(200)
          .json({ success: "Logged In Successfully.", auth });
      }
    });

    // Successful authentication, redirect to secrets.
  }
);
module.exports = router;
