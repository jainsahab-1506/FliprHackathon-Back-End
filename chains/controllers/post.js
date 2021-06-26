const Chain = require("./../model");
const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const createchain = (req, res) => {
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
          User.find({ _id: req.body.userid }, function (err, owner) {
            if (!owner) {
              return res.status(400).json({
                error:
                  "No such user exists. Cannot show Chains without a valid owner.",
              });
            }
            const chaindata = new Chain({
              chainname: req.body.chainname,
              userid: req.body.userid,
              emailgroupid: req.body.emailgroupid,
              message: req.body.message,
              frequency: req.body.frequency,
              status: false,
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
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = createchain;
