const mongoose = require("mongoose");
const chainSchema = new mongoose.Schema({
  chainname: { type: String, required: true },
  emailgroupid: {
    type: mongoose.ObjectId,
    required: true,
  },
  messageid: { type: mongoose.ObjectId, required: true },
  userid: {
    type: mongoose.ObjectId,
    required: true,
  },
  frequency: { type: Object, required: true },
  status: { type: Boolean },
});

module.exports.Chain = new mongoose.model("Chains", chainSchema);
