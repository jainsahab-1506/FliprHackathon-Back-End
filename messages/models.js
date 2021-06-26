const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  attachments: {
    type: Array,
  },
});

module.exports.Messages = new mongoose.model("Messages", messageSchema);
