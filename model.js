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
  Id: String,
  token: String,
});
const chainSchema = new mongoose.Schema({
  chainname: String,
  emailgroupid: String,
  message: Object,
  userid: String,
  frequency: Object,
});

module.exports.userSchema = userSchema;
module.exports.tokenSchema = tokenSchema;
module.exports.chainSchema = chainSchema;
