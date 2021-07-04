const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const Credentials = require("./models.js");
const axios = require("axios");

const { userSchema, tokenSchema } = require("./models.js");
const qs = require("qs");
const User = new mongoose.model("User", userSchema);

const Token = new mongoose.model("Token", tokenSchema);

router.post("/addmailcred", function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        error: "Invalid request headers.",
      });
    }
    const tokenData = authHeader.split(" ")[1];
    if (!tokenData) {
      return res.status(400).json({
        error: "Invalid token.",
      });
    }

    Token.findOne({ token: tokenData }, async function (err, token) {
      if (!token) {
        return res.status(400).json({
          error: "Invalid token.",
        });
      } else {
        const authcode = req.body.authcode;
        console.log(authcode);
        try {
          const time = Math.round(new Date() / 1000);

          const resp = await axios({
            method: "POST",
            url: "https://oauth2.googleapis.com/token",
            data: qs.stringify({
              grant_type: "authorization_code",
              client_secret: process.env.CLIENT_SECRET,
              client_id: process.env.CLIENT_ID,
              redirect_uri: process.env.SITE_URL,
              code: authcode,
            }),
            headers: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          });
          console.log(resp.data);
          const profres = await axios({
            method: "GET",
            url:
              "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" +
              resp.data.access_token,
          });
          await Credentials.deleteMany({ userid: token.userid });

          const credentials = new Credentials({
            email: profres.data.email,
            access_token: resp.data.access_token,
            refresh_token: resp.data.refresh_token,
            expiry_time: time + resp.data.expires_in,
            creation_time: new Date(),
            userid: token.userid,
            name: profres.data.name,
          });
          console.log(time + 3600);
          await credentials.save();
          var updateduser = await User.findOneAndUpdate(
            { _id: token.userid },
            { mailCredentialsId: credentials._id, verified: true }
          );

          updateduser = await User.findOne({
            _id: token.userid,
          }).populate("mailCredentialsId");
          return res.status(200).json(updateduser.mailCredentialsId);
        } catch (error) {
          console.log(error);
          return res.status(400).json({ Error: error.message });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }

  // Successful authentication, redirect to secrets.
});
module.exports = router;
