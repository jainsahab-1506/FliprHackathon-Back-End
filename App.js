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
const oauthloginroutes = require("./oauthlogin.js");
const logoutroutes = require("./logout.js");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.json());
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

//
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.send("Hello");
});
app.post("/register", register);
app.post("/login", login);
app.use("/", oauthloginroutes);
app.use("/", logoutroutes);

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Running");
});
