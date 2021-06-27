const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const credentialsSchema = require("./models.js");

const Credentials = new mongoose.model("Credentials", credentialsSchema);
const { tokenSchema } = require("./models.js");

const Token = new mongoose.model("Token", tokenSchema);

router.post(
  "/addemail",

  function (req, res) {
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

      Token.findOne({ token: tokenData }, function (err, token) {
        if (!token) {
          return res.status(400).json({
            error: "Invalid token.",
          });
        } else {
          const cred = new Credentials({
            email: req.body.email,
            token: req.body.token,
          });
          return res
            .status(200)
            .json({ Success: "Authorization Done", id: cred._id });
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Successful authentication, redirect to secrets.
  }
);
module.exports = router;
