const mongoose = require("mongoose");
const { Messages } = require("./../models");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const getmessage = (req, res) => {
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
          User.find({ _id: ownerId }, function (err, owner) {
            if (!owner) {
              return res.status(400).json({
                error:
                  "No such user exists. Cannot show Chains without a valid owner.",
              });
            }
            Messages.find({ _id: req.params.id }, function (err, message) {
              if (err) {
                return res.status(400).json({
                  error: "Cannot Fetch",
                });
              } else {
                return res
                  .status(200)
                  .json({ success: "Message Found", message });
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
module.exports = getmessage;
