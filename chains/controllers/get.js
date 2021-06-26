const { Chain, Messages } = require("./../model");
const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const getchains = (req, res) => {
  try {
    console.log("called");
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        error: "Invalid request headers.",
      });
    }

    const tokenData = authHeader.split(" ")[1];
    if (!tokenData) {
      return res.status(400).json({
        error: "Invalid token.",
      });
    }

    Token.findOne({ token: tokenData }, function (err, token) {
      if (!token) {
        return res.status(400).json({
          error: "Unauthorized request.",
        });
      } else {
        if (req.params.id) {
          Chain.find({ _id: req.params.id }, function (err, chaindata) {
            if (err) {
              return res.status(400).json({
                error: "Cannot Fetch",
              });
            } else {
              return res.status(200).json({ success: "Data Found", chaindata });
            }
          });
        } else {
          Chain.find({ userid: token.userid }, function (err, chains) {
            if (err) {
              return res.status(400).json({
                error: "Cannot Fetch",
              });
            } else {
              return res.status(200).json({ success: "Data Found", chains });
            }
          });
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = getchains;
