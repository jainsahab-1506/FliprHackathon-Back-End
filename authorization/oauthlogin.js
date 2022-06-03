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

router.post("/oauthlogin", async function (req, res) {
  try {
    const token = req.body.accessToken;
    const profile = req.body.profileObj;
    var newUserName = profile.givenName + profile.googleId;
    console.log(profile);
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
    console.log(error);
    return res.status(400).json({ Error: error.message });
  }

  // Successful authentication, redirect to secrets.
});
module.exports = router;
