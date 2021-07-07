const { Chain } = require("./../model");
const { Messages } = require("../../messages/models");
const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const axios = require("axios");
const Token = new mongoose.model("Token", tokenSchema);
const EmailGroup = require("../../email-group/model");
const fs = require("fs");
const deletechain = (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
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
          error: "Invalid token.",
        });
      } else {
        try {
          const chain = await Chain.findOne({ _id: id })
            .populate("emailgroupid")
            .populate("messageid");

          console.log(chain);
          // if (chain.userid.toString() !== token.userid.toString()) {
          //   return res
          //     .status(400)
          // //     .json("Error:You are not Authorized to delete");
          // // }

          console.log(chain.messageid.attachments);
          chain.messageid.attachments.forEach((file) => {
            fs.unlinkSync(`${process.env.PWD}/${file.path}`);
          });
          await Chain.deleteOne({ _id: id });
          await Messages.deleteOne({ _id: chain.messageid._id });
          const resp = await axios({
            method: "Delete",
            url: process.env.SERVER_URL1 + "/deletecron/" + id,
            data: {
              files: chain.messageid.attachments,
            },
            headers: {
              Authorization: "Bearer " + tokenData,
            },
          });
          console.log(resp.data);
          return res
            .status(200)
            .json({ success: "Chain Successfully Deleted." });
        } catch (err) {
          console.log(err);
          return res.status(400).json({
            error: "Unable to delete",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
module.exports = deletechain;
