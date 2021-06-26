const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  email: String,
  firstName: String,
  lastName: String,
  mailCredentialsId: { type: mongoose.ObjectId },
  verified: Boolean,
});
const tokenSchema = new mongoose.Schema({
  userid: { type: mongoose.ObjectId, unique: true, index: true },
  token: String,
});

module.exports.userSchema = userSchema;
module.exports.tokenSchema = tokenSchema;
