const mongoose = require("mongoose");
const Messages = require("./../messages/models");
const EmailGroup = require("./../email-group/model");
const chainSchema = new mongoose.Schema({
  chainname: { type: String, required: true },
  emailgroupid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Email Group",
    required: true,
  },
  messageid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
    required: true,
  },
  userid: {
    type: mongoose.ObjectId,
    required: true,
  },
  frequency: { type: Object, required: true },
  status: { type: Boolean },
});

module.exports.Chain = new mongoose.model("Chains", chainSchema);
