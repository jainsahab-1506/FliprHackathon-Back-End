const { Chain } = require("./../model");
const { Messages } = require("./../../messages/models");
const EmailGroup = require("./../../email-group/model");
const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const getchains = async (req, res) => {
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

    Token.findOne({ token: tokenData }, async function (err, token) {
      if (!token) {
        return res.status(400).json({
          error: "Unauthorized request.",
        });
      } else {
        console.log(req.params.id);
        if (req.params.id) {
          const chaindata = await Chain.findOne({
            _id: req.params.id,
          })
            .populate("emailgroupid")
            .populate("messageid");

          return res.status(200).json({
            success: "Data Found",
            chaindata,
          });
        } else {
          const chains = await Chain.find({
            userid: token.userid,
          }).populate("emailgroupid");

          return res.status(200).json({ success: "Data Found", chains });
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = getchains;
