const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  email: String,
  firstName: String,
  lastName: String,
});
const tokenSchema = new mongoose.Schema({
  userid: mongoose.ObjectId,
  token: String,
});

module.exports.userSchema = userSchema;
module.exports.tokenSchema = tokenSchema;
