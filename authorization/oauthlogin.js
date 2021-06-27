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

var userprofile, authtoken;
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.SERVER_URL + "/auth/google/secrets",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       var newUserName = profile.name.givenName + profile.id;
//       authtoken = accessToken;
//       User.findOrCreate(
//         {
//           googleId: profile.id,
//           username: newUserName,
//           firstName: profile.name.givenName,
//           lastName: profile.name.familyName,
//           email: profile.emails[0].value,
//           password: "",
//           verified: false,
//         },
//         function (err, user) {
//           userprofile = user;

//           return cb(err, user);
//         }
//       );
//     }
//   )
// );
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
router.post("/oauthlogin", function (req, res) {
  const token = req.body.accessToken;
  const profile = req.body.profileObj;
  var newUserName = profile.givenName + profile.googleId;
  User.findOrCreate(
    {
      googleId: profile.googleId,
      username: newUserName,
      firstName: profile.givenName,
      lastName: profile.familyName,
      email: profile.email,
      password: "",
      verified: false,
    },
    function (err, user) {
      var tokendata = new Token({
        token: token,
        userid: user._id,
      });

      tokendata.save(function (err, auth) {
        if (err) {
          Token.findOne({ userid: user._id }, function (error, resp) {
            console.log(resp);
            if (resp) {
              return res.status(400).json({ error: "User Already Logged In " });
            } else {
              return res.status(400).json({ error: "Internal Server Error " });
            }
          });
        } else {
          return res.status(200).json({
            success: "Logged In Successfully.",
            token: token,
            profile: user,
          });
        }
      });
    }
  );

  // Successful authentication, redirect to secrets.
});
module.exports = router;
