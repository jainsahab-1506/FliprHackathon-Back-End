const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});

module.exports = userSchema;
// CLIENT_ID=97781066717-peq315812iffrl0jc4q2jdsbn1hjlrn8.apps.googleusercontent.com
// CLIENT_SECRET=nYdRwitf8P_nh3pF9LNGTMj1
