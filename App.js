const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const register = require("./register");
const login = require("./login");
const oauthlogin = require("./oauthlogin");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect(
  "mongodb+srv://admin-naman:" +
    process.env.CLUSTER_PASSWORD +
    "@cluster0.3djy5.mongodb.net/FliperDB?retryWrites=true&w=majority",
  { useNewUrlParser: true }
  //   () => {
  //     console.log("Database connected.");
  //   }
);

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
//
const userSchema = require("./model");

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
//
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.send("Hello");
});
app.post("/register", register);
app.post("/login", login);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    scope: ["profile"],
    failureRedirect: "/",
  }),
  function (req, res) {
    // Successful authentication, redirect to secrets.
    res.send("Login");
  }
);

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Running");
});
