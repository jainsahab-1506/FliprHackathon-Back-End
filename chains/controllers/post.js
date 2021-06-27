const mongoose = require("mongoose");

const { Chain } = require("./../model");
const { Messages } = require("./../../messages/models");
const { userSchema, tokenSchema } = require("../../model");

const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const freq = ["Daily", "Weekly", "Monthly", "Yearly"];
const authorizeRequest = (req, res, next) => {
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
        next();
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const createchain = (req, res) => {
  try {
    const chain = JSON.parse(req.body.body);
    User.find({ _id: chain.userid }, function (err, owner) {
      if (!owner) {
        return res.status(400).json({
          error:
            "No such user exists. Cannot show Chains without a valid owner.",
        });
      }
      const chain = JSON.parse(req.body.body);
      const messages = new Messages({
        text: chain.messageid.text,
        attachments: req.files,
      });
      const freqgiven = chain.frequency;
      if (
        freqgiven.period == freq[0] &&
        freqgiven.repeat != 20 &&
        freqgiven.repeat != 30
      ) {
        return res.status(400).json({
          error: "Frequency is not Valid",
        });
      }
      if (
        freqgiven.period != freq[0] &&
        freqgiven.period != freq[1] &&
        freqgiven.period != freq[2] &&
        freqgiven.period != freq[3]
      ) {
        return res.status(400).json({
          error: "Frequency is not Valid",
        });
      }
      const chaindata = new Chain({
        chainname: chain.chainname,
        userid: chain.userid,
        emailgroupid: chain.emailgroupid,
        messageid: messages._id,
        frequency: chain.frequency,
        status: false,
      });

      messages.save(function (err, savedmessage) {
        if (err) {
          return res.status(400).json({
            error: { err },
          });
        }
        console.log(savedmessage);
      });

      chaindata.save(function (err, chainsaved) {
        if (err) {
          return res.status(400).json({
            error: { err },
          });
        } else {
          return res
            .status(200)
            .json({ success: "Chain Created.", chainsaved });
        }
      });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports.createchain = createchain;
module.exports.authorizeRequest = authorizeRequest;
