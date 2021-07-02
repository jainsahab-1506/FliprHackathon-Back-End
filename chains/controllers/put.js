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
        const id = req.params.id;
        const chain = JSON.parse(req.body.body);
        console.log(chain);
        // req.on("data", function (data) {
        // const chain = JSON.parse(data);
        // console.log(data);
        // console.log(data.toString());
        // console.log(typeof chain);
        // console.log(chain);
        const chaindata = {
          chainname: chain.chainname,
          userid: chain.userid,
          emailgroupid: chain.emailgroupid,
          messageid: chain.messageid,
          frequency: chain.frequency,
          status: chain.status,
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
        // });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const editchain = async (req, res) => {
  try {
    const id = req.params.id;

    // req.on("data", async function (data) {
    console.log(req.files);
    const chains = JSON.parse(req.body.body);
    const messageId = chains.messageid._id;

    const message = await Messages.findOneAndUpdate(
      { _id: messageId },
      {
        text: chains.messageid.text,
        attachments:
          req.files.length > 0 ? req.files : chains.messageid.attachments,
      },
      { new: true, omitUndefined: true, runValidators: true }
    );
    const chain = await Chain.findById(id).populate("messageid");
    return res.status(200).json({ success: "Chain updated.", chain });
    // });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports.editchain = editchain;
module.exports.authorizeUpdate = authorizeUpdate;
