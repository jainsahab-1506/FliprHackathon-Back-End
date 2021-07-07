const mongoose = require("mongoose");

const { userSchema } = require("./../model");
const User = new mongoose.model("User", userSchema);
const { Chain } = require("../chains/model");

const emailGroupSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  to: {
    type: [{ type: String }],
    required: true,
  },
  cc: {
    type: [{ type: String }],
  },
  bcc: {
    type: [{ type: String }],
  },

  // chains: {
  //   type: mongoose.Schema.Types.Relationship,
  //   ref: "Chains",
  //   refPath: "emailgroupid",
  // },
});
emailGroupSchema.virtual("chains", {
  ref: "Chains", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "emailgroupid", // is equal to femailGroupSchema
});
// Set Object and Json property to true. Default is set to false
emailGroupSchema.set("toObject", { virtuals: true });
emailGroupSchema.set("toJSON", { virtuals: true });

module.exports = new mongoose.model("Email Group", emailGroupSchema);
