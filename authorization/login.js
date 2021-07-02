const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const { userSchema, tokenSchema } = require("../model");
const jwt = require("jsonwebtoken");
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
const login = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      res.send(err);
    } else {
      passport.authenticate("local")(req, res, async function () {
        try {
          const user = await User.findOne({
            username: req.body.username,
          }).populate("mailCredentialsId");
          console.log(user);
          const token = jwt.sign(
            {
              userId: user.username,
            },
            process.env.SECRET
          );
          console.log(token);
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
        } catch (err) {
          return res.status(400).json({ Error: err.message });
        }
      });
    }
  });
};
module.exports = login;
//jshint esversion:6
