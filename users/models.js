const mongoose = require("mongoose");

const credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = credentialsSchema;
