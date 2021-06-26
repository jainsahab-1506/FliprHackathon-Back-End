const mongoose = require("mongoose");

const { Chain } = require("./../model");
const { Messages } = require("./../../messages/models");
const { userSchema, tokenSchema } = require("../../model");

const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);

const authorizeUpdate = (req, res, next) => {
  try {
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
          error: "Invalid token.",
        });
      } else {
        const tokenOwner = token.userid;

        const id = req.params.id;

        const chaindata = {
          chainname: req.body.chainname,
          userid: req.body.userid,
          emailgroupid: req.body.emailgroupid,
          message: req.body.message,
          frequency: req.body.frequency,
          status: req.body.status,
        };
        Chain.findOneAndUpdate(
          { _id: id },
          chaindata,
          { new: true, omitUndefined: true, runValidators: true },
          function (err, updatedchain) {
            if (err) {
              return res.status(400).json({
                error: "Cannot Update Chain",
              });
            } else {
              next();
            }
          }
        );
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const editchain = async (req, res) => {
  try {
    const id = req.params.id;
    const chain = await Chain.findById(id);

    const messageId = chain.messageid;
    const message = await Message.findOneAndUpdate(
      { _id: messageId },
      { text: req.body.message, attachments: req.files },
      { new: true, omitUndefined: true, runValidators: true }
    );

    return res.status(200).json({ success: "Chain updated.", chain });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports.editchain = editchain;
module.exports.authorizeUpdate = authorizeUpdate;
