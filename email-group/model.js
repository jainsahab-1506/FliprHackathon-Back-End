const mongoose = require("mongoose");

const emailGroupSchema = mongoose.Schema({
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  cc: {
    type: [String],
  },
  bcc: {
    type: [String],
  },
});

module.exports = new mongoose.model("Email Group", emailGroupSchema);
