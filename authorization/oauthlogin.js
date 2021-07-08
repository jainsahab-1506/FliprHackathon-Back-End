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
<<<<<<< HEAD
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
=======
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
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
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
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
>>>>>>> naman_jain

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
router.post("/oauthlogin", async function (req, res) {
  try {
    const token = req.body.accessToken;
    const profile = req.body.profileObj;
    var newUserName = profile.givenName + profile.googleId;
    const user = await User.findOne({ googleId: profile.googleId }).populate(
      "mailCredentialsId"
    );
    console.log(user);
    if (user) {
      var tokendata = new Token({
        token: token,
        userid: user._id,
      });
      await Token.deleteMany({ userid: user._id });
      await tokendata.save();
      return res.status(200).json({
        success: "Logged In Successfully.",
        token: token,
        profile: user,
      });
    } else {
      const newuser = new User({
        googleId: profile.googleId,
        username: newUserName,
        firstName: profile.givenName,
        lastName: profile.familyName,
        email: profile.email,
        password: "",
        verified: false,
        mailCredentialsId: "",
      });
      await newuser.save();
      var tokendata = new Token({
        token: token,
        userid: newuser._id,
      });

      await tokendata.save();
      return res.status(200).json({
        success: "Logged In Successfully.",
        token: token,
        profile: newuser,
      });
    }
  } catch (error) {
    return res.status(400).json({ Error: error.message });
  }

  // Successful authentication, redirect to secrets.
});
module.exports = router;
