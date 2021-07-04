const mongoose = require("mongoose");

const credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  expiry_time: {
    type: Number,
    required: true,
  },
  creation_time: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Credentials", credentialsSchema);
