const { userSchema, tokenSchema } = require("../../model");
const mongoose = require("mongoose");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const Credentials = require("../../users/models");
const { Chain } = require("../../chains/model");
const mimemessage = require("mimemessage");
const path = require("path");
const fs = require("fs");
const qs = require("qs");
const mime = require("mime-types");
const axios = require("axios");
const domail = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        error: "Invalid request headers.",
      });
    }

    const tokenData = authHeader.split(" ")[1];
    console.log(tokenData);
    if (!tokenData) {
      return res.status(400).json({
        error: "Invalid token.",
      });
    }

    Token.findOne({ token: tokenData }, async function (err, token) {
      console.log(token);
      if (!token) {
        return res.status(400).json({
          error: "Invalid token.",
        });
      } else {
        //main Logic
        const tokenOwner = token.userid;
        const chainId = req.params.id;
        //finding chaindata
        const chaindata = await Chain.findOne({ _id: chainId })
          .populate("messageid")
          .populate("emailgroupid");

        //findinguserdata
        const user = await User.findOne({ _id: chaindata.userid }).populate(
          "mailCredentialsId"
        );

        const attachments = chaindata.messageid.attachments;
        // var emailgroupto = "";
        // chaindata.emailgroupid.to.forEach((email) => {
        //   emailgroupto = emailgroupto + email + ",";
        // });
        // emailgroupto = emailgroupto.slice(0, -1);

        // //Converting CC and BCC Array into singleString
        // var emailgroupcc = "";
        // var emailgroupbcc = "";
        // chaindata.emailgroupid.cc.forEach((email) => {
        //   emailgroupcc = emailgroupcc + email + ",";
        // });
        // emailgroupcc = emailgroupcc.slice(0, -1);

        // chaindata.emailgroupid.bcc.forEach((email) => {
        //   emailgroupbcc = emailgroupbcc + email + ",";
        // });
        // emailgroupbcc = emailgroupbcc.slice(0, -1);
        //mime Type Object
        var mailContent = mimemessage.factory({
          contentType: "multipart/mixed",
          body: [],
        });

        //addingHeaders
        mailContent.header("From", "namujain266@gmail.com");
        mailContent.header("To", "2019UCP1390@mnit.ac.in");
        mailContent.header("CC", "2019UCP1388@mnit.ac.in");
        mailContent.header("Subject", "Test Mail");
        // mailContent.header("BCC", emailgroupbcc);
        //textEntity

        var plainEntity = mimemessage.factory({
          body: chaindata.messageid.text,
        });
        var oauthtoken =
          "ya29.a0ARrdaM8k-wbCfmJKLvl_zelr7Y4CIJkPj5BB8bL-4yge6_UWX-otjo69brBLGIrRB5FS1LclRYguAVsf9_CMJxPfAkMtVcCCLMrNCLORWHKR-sgdm9iPt-iRiAzGk7bE5yc3w2zQmLLksSnJnovGSwmTHj64";
        mailContent.body.push(plainEntity);
        console.log(process.env.PWD);
        attachments.forEach((file) => {
          var fileext = mime.extension(file.mimetype);
          var data = fs.readFileSync(
            `${process.env.PWD}/${file.path}.${fileext}`
          );

          var attachmentEntity = mimemessage.factory({
            contentType: file.mimetype,
            contentTransferEncoding: "base64",
            body: data.toString("base64").replace(/([^\0]{76})/g, "$1\n"),
          });
          attachmentEntity.header(
            "Content-Disposition",
            `attachment;filename="${file.originalname}"`
          );
          mailContent.body.push(attachmentEntity);
        });
        const curtime = Math.round(new Date() / 1000);
        if (curtime < user.mailCredentialsId.expiry_time) {
          try {
            var resp = await axios({
              method: "POST",
              url: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",

              data: {
                raw: Buffer.from(mailContent.toString()).toString("base64"),
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + oauthtoken,
              },
            });
            return res.status(200).json("Success:Mail is Done");
          } catch (err) {
            return res.status(400).json({ Error: err.message });
          }
        } else {
          const curtime = Math.round(new Date() / 1000);
          var resp = await axios({
            method: "POST",
            url: "https://oauth2.googleapis.com/token",
            data: qs.stringify({
              grant_type: "refresh_token",
              client_secret: process.env.CLIENT_SECRET,
              client_id: process.env.CLIENT_ID,
              refresh_token: user.mailCredentialsId.refresh_token,
            }),
            headers: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          });

          await Credentials.findOneAndUpdate(
            { _id: user.mailCredentialsId._id },
            {
              access_token: resp.data.access_token,
              expiry_time: resp.data.expires_in + curtime,
            }
          );
          oauthtoken = resp.data.access_token;
          try {
            var resp = await axios({
              method: "POST",
              url: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",

              data: {
                raw: Buffer.from(mailContent.toString()).toString("base64"),
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + oauthtoken,
              },
            });
            return res.status(200).json("Success:Mail is Done");
          } catch (err) {
            return res.status(400).json({ err: err.message });
          }
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = domail;
