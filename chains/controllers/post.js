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
        const tokenOwner = token.userid;
        const ownerId = req.params.ownerid;
        if (tokenOwner.toString() !== ownerId.toString()) {
          console.log("Expected:", tokenOwner);
          console.log("Found:", ownerId);

          return res.status(400).json({
            error: "Unauthorized request.",
          });
        } else {
          next();
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const createchain = (req, res) => {
  try {
    User.find({ _id: req.body.userid }, function (err, owner) {
      if (!owner) {
        return res.status(400).json({
          error:
            "No such user exists. Cannot show Chains without a valid owner.",
        });
      }

      const messages = new Messages({
        text: req.body.messagetext,
        attachments: req.files,
      });
      const freqgiven = req.body.frequency;
      if (
        (freqgiven.type == freq[0] && freqgiven.time < 20) ||
        freqgiven.time > 30
      ) {
        return res.status(400).json({
          error: "Frequency is not Valid",
        });
      }
      if (
        freqgiven != freq[0] &&
        freqgiven != freq[1] &&
        freqgiven != freq[2] &&
        freqgiven != freq[3]
      ) {
        return res.status(400).json({
          error: "Frequency is not Valid",
        });
      }
      const chaindata = new Chain({
        chainname: req.body.chainname,
        userid: req.body.userid,
        emailgroupid: req.body.emailgroupid,
        messageid: messages._id,
        frequency: req.body.frequency,
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
