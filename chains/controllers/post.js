const mongoose = require("mongoose");

const { Chain } = require("./../model");
const { Messages } = require("./../../messages/models");
const { userSchema, tokenSchema } = require("../../model");
const fs = require("fs");
var FormData = require("form-data");
var mime = require("mime-types");
const calculatefrequency = require("../../utils/calculatefrequency");
const axios = require("axios");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const freq = ["Recurring", "Weekly", "Monthly", "Yearly"];
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
    console.log(tokenData);
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

const createchain = async (req, res) => {
  try {
    console.log(req.files);
    var fd = new FormData();
    req.files.forEach((file) => {
      var data = fs.createReadStream(process.env.PWD + "/" + file.path);
      fd.append("files", data);
    });
    // console.log(fd);
    var resp = await axios({
      method: "post",
      url: process.env.SERVER_URL1 + "/uploadfiles",
      data: fd,
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + fd.getBoundary(),
      },
    });
    const authHeader = req.headers.authorization;
    const tokenData = authHeader.split(" ")[1];
    const chain = JSON.parse(req.body.body);
    console.log(chain);
    User.find({ _id: chain.userid }, function (err, owner) {
      if (!owner) {
        return res.status(400).json({
          error:
            "No such user exists. Cannot create chains without a valid owner.",
        });
      }
      const messages = new Messages({
        text: chain.messageid.text,
        attachments: req.files,
      });
      const freqgiven = chain.frequency;
      if (
        freqgiven.period == freq[0] &&
        freqgiven.seconds != 20 &&
        freqgiven.seconds != 30
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
        status: chain.status,
      });
      var newfrequency = calculatefrequency(chain.frequency);
      messages.save(function (err, savedmessage) {
        if (err) {
          return res.status(400).json({
            error: { err },
          });
        }
        console.log(savedmessage);
      });

      chaindata.save(async function (err, chainsaved) {
        if (err) {
          return res.status(400).json({
            error: { err },
          });
        } else {
          var fd = newFormData();
          req.file.forEach((file) => {
            var data = fs.readFileSync(process.env.PWD + "/" + file.path);
            fd.append(data);
          });
          console.log(fd);
          try {
            resp = await axios({
              method: "POST",
              url: process.env.SERVER_URL1 + "/createcron",

              data: {
                frequency: newfrequency,
                status: chaindata.status,
                id: chaindata._id,
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenData,
              },
            });

            return res
              .status(200)
              .json({ success: "Chain Created.", chainsaved });
          } catch (err) {
            return res.status(400).json({ err: err.message });
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
module.exports.createchain = createchain;
module.exports.authorizeRequest = authorizeRequest;
