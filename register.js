const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const { userSchema } = require("./model");

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const register = (req, res) => {
  console.log(req.body);
  User.register(
    {
      username: req.body.username,
      email: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        passport.authenticate("local")(req, res, function () {
          User.find({ username: req.body.username }, function (err, userinfo) {
            if (!err) {
              res.send(userinfo);
            } else {
              res.send(err);
            }
          });
        });
      }
    }
  );
};

//jshint esversion:6
module.exports = register;
