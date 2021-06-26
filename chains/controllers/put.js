const Chain = require("./../model");
const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const Token = new mongoose.model("Token", tokenSchema);
const editchain = (req, res) => {
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
          const id = req.params.id;
          const chaindata = {
            chainname: req.body.chainname,
            userid: req.body.userid,
            emailgroupid: req.body.emailgroupid,
            message: req.body.message,
            frequency: req.body.frequency,
            status: req.body.status,
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
                return res
                  .status(200)
                  .json({ success: "Chain Updated.", updatedchain });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = editchain;
