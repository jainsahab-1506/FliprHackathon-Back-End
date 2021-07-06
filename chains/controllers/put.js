const mongoose = require("mongoose");
const axios = require("axios");
const { Chain } = require("./../model");
const { Messages } = require("./../../messages/models");
const EmailGroup = require("../../email-group/model");
const { userSchema, tokenSchema } = require("../../model");
const fs = require("fs");
const calculatefrequency = require("../../utils/calculatefrequency");
const FormData = require("form-data");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
var prevstatus;
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

    Token.findOne({ token: tokenData }, async function (err, token) {
      if (!token) {
        return res.status(400).json({
          error: "Invalid token.",
        });
      } else {
        const id = req.params.id;
        const prevchain = await Chain.findOne({ _id: id }).populate(
          "emailgroupid"
        );
        // if (prevchain.userid.toString() !== token.userid.toString()) {
        //   return res.status(400).json("Error:You are not Authorized to Update");
        // }
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
        console.log(prevchain);
        var linkedchains = prevchain.emailgroupid.chains;
        var ind = linkedchains.indexOf(id);
        EmailGroup.updateOne(
          { _id: prevchain.emailgroupid._id },
          { $pop: { chains: ind } }
        );

        Chain.findOneAndUpdate(
          { _id: id },
          chaindata,
          { new: true, omitUndefined: true, runValidators: true },
          async function (err, updatedchain) {
            if (err) {
              return res.status(400).json({
                error: "Cannot Update Chain",
              });
            } else {
              await EmailGroup.updateOne(
                { _id: chain.emailgroupid },
                { $push: { chains: [updatedchain._id] } }
              );
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
    const authHeader = req.headers.authorization;
    const tokenData = authHeader.split(" ")[1];
    // req.on("data", async function (data) {
    const chain = await Chain.findOne({ _id: id }).populate("messageid");
    const chains = JSON.parse(req.body.body);
    const messageId = chains.messageid._id;
    if (req.files.length > 0 && chain.messageid.attachments.length > 0) {
      chain.messageid.attachments.forEach((file) => {
        fs.unlinkSync(`${process.env.PWD}/${file.path}`);
      });
    }
    if (req.files.length > 0) {
      var fd = new FormData();
      req.files.forEach((file) => {
        console.log(process.env.PWD + "/" + file.path);
        var data = fs.createReadStream(process.env.PWD + "/" + file.path);
        fd.append("files", data);
      });
      fd.append("data", JSON.stringify(chain.messageid.attachments));
      console.log(fd);
      try {
        var resp = await axios({
          method: "post",
          url: process.env.SERVER_URL1 + "/uploadfiles",
          data: fd,
          headers: {
            "Content-Type": "multipart/form-data; boundary=" + fd.getBoundary(),
          },
        });
        console.log(resp.data);
      } catch (err) {
        console.log(err);
      }
    }
    const message = await Messages.findOneAndUpdate(
      { _id: messageId },
      {
        text: chains.messageid.text,
        attachments:
          req.files.length > 0 ? req.files : chain.messageid.attachments,
      },
      { new: true, omitUndefined: true, runValidators: true }
    );
    try {
      var resp = await axios({
        method: "POST",
        url: process.env.SERVER_URL1 + "/updatecron",

        data: {
          frequency: calculatefrequency(chains.frequency),
          id: chains._id,
          status: chains.status,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData,
        },
      });

      const chain = await Chain.findById(id).populate("messageid");
      return res.status(200).json({ success: "Chain updated.", chain });
    } catch (err) {
      return res.status(400).json({ err: err.message });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports.editchain = editchain;
module.exports.authorizeUpdate = authorizeUpdate;
