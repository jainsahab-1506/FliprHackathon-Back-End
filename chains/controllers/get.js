const Chain = require("./../model");
const mongoose = require("mongoose");
const { userSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const getchains = (req, res) => {
  const id = req.params.id;

  User.find({ _id: id }, function (owner) {
    if (!owner) {
      return res.status(400).json({
        error: "No such user exists. Cannot show Chains without a valid owner.",
      });
    }
    Chain.find({ userid: id }, function (err, chains) {
      if (err) {
        return res.status(400).json({
          error: "Cannot Fetch",
        });
      } else {
        return res.status(200).json({ success: "Data Found", chains });
      }
    });
  });
};
module.exports = getchains;
