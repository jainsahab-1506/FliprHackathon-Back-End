const mongoose = require("mongoose");
const Credentials = require("./users/models");
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  googleId: String,
  email: String,
  firstName: String,
  lastName: String,
  mailCredentialsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Credentials",
  },
  verified: Boolean,
});
const tokenSchema = new mongoose.Schema({
  userid: { type: mongoose.ObjectId, unique: true, index: true },
  token: String,
});

module.exports.userSchema = userSchema;
module.exports.tokenSchema = tokenSchema;
