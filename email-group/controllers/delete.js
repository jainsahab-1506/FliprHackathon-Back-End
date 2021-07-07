const mongoose = require("mongoose");

const EmailGroup = require("./../model");
const { tokenSchema } = require("../../model");
const { Chain } = require("../../chains/model");
const { Messages } = require("../../messages/models");
const axios = require("axios");
const Token = new mongoose.model("Token", tokenSchema);
const fs = require("fs");
const deleteEmailGroup = async (req, res) => {
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

    const token = await Token.findOne({ token: tokenData });
    if (!token) {
      return res.status(400).json({
        error: "Invalid token.",
      });
    }

    const tokenOwner = token.userid;

    const emailGroupId = req.params.id;
    const emailGroup = await EmailGroup.findById(emailGroupId).populate(
      "chains"
    );

    if (!emailGroup) {
      return res.status(400).json({
        error: "Invalid request.",
      });
    }

    console.log(emailGroup);

    const ownerId = emailGroup.owner;
    if (tokenOwner.toString() !== ownerId.toString()) {
      console.log("Expected:", tokenOwner, typeof tokenOwner);
      console.log("Found:", ownerId, typeof ownerId);

      return res.status(400).json({
        error: "Unauthorized request.",
      });
    }
    emailGroup.chains.forEach(async (chain) => {
      var chaindata = await Chain.findOne({ _id: chain._id }).populate(
        "messageid"
      );
      chaindata.messageid.attachments.forEach((file) => {
        fs.unlinkSync(`${process.env.PWD}/${file.path}`);
      });
      const resp = await axios({
        method: "Delete",
        url: process.env.SERVER_URL1 + "/deletecron/" + chain._id,
        data: {
          files: chaindata.messageid.attachments,
        },
        headers: {
          Authorization: "Bearer " + tokenData,
        },
      });
      await Chain.deleteOne({ _id: chain._id });
      await Messages.deleteOne({ _id: chaindata.messageid._id });
    });
    EmailGroup.deleteOne({ _id: emailGroupId }, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res
        .status(200)
        .json({ success: "Email Group deleted successfully." });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = deleteEmailGroup;
