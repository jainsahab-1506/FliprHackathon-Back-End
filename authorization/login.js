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
      passport.authenticate("local")(req, res, function () {
        User.findOne({ username: req.body.username }, function (err, userinfo) {
          if (!err) {
            const token = jwt.sign(
              {
                userId: userinfo.username,
              },
              process.env.SECRET
            );
            var tokendata = new Token({
              token: token,
              userid: userinfo._id,
            });

            tokendata.save(function (err, auth) {
              if (err) {
                Token.findOne({ userid: userinfo._id }, function (error, resp) {
                  if (resp) {
                    return res
                      .status(400)
                      .json({ error: "User Already Logged In " });
                  } else {
                    return res
                      .status(400)
                      .json({ error: "Internal Server Error " });
                  }
                });
              } else {
                return res
                  .status(200)
                  .json({
                    success: "Logged In Successfully.",
                    token: auth.token,
                    profile: userinfo,
                  });
              }
            });
          } else {
            return res.status(400).json({ error: "Email Exists " });
          }
        });
      });
    }
  });
};
module.exports = login;
//jshint esversion:6
