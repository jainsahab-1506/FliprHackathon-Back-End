const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const credentialsSchema = require("./models.js");
credentialsSchema.plugin(passportLocalMongoose);
credentialsSchema.plugin(findOrCreate);
const Credentials = new mongoose.model("Credentials", credentialsSchema);

var id;
passport.use(
  "google-alt",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/addemail",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      var cred;
      // Credentials.find(
      //   { email: profile.emails[0].value },
      //   function (err, credi) {
      //     if (credi) {
      //       cred = credi;
      //       id = cred._id;
      //     } else {
      //       const newtoken = new Credentials({
      //         email: profile.emails[0].value,
      //         token: accessToken,
      //       });
      //       newtoken.save(function (err, resp) {
      //         id = resp._id;
      //         cred = resp;
      //       });
      //     }
      //     return cb(err, cred);
      //   }
      // );
      var newusername = profile.emails[0].value + new Date();
      console.log(newusername);
      Credentials.findOrCreate(
        {
          username: newusername,
          email: profile.emails[0].value,
          token: accessToken,
        },
        function (err, cred) {
          id = cred._id;

          return cb(err, cred);
        }
      );
    }
  )
);
passport.serializeUser(function (cred, done) {
  done(null, cred.id);
});

passport.deserializeUser(function (id, done) {
  Credentials.findById(id, function (err, cred) {
    done(err, cred);
  });
});
router.get(
  "/auth/google/add",
  passport.authenticate("google-alt", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/addemail",
  passport.authenticate("google-alt", {
    scope: ["profile", "email"],
    failureRedirect: "/",
  }),
  function (req, res) {
    return res.status(200).json({ Success: "Authorization Done", id: id });
    // Successful authentication, redirect to secrets.
  }
);
module.exports = router;
