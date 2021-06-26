const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { tokenSchema } = require("../model");
const Token = new mongoose.model("Token", tokenSchema);
router.delete("/logout", function (req, res) {
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
          error: "Unauthorized request.",
        });
      } else {
        Token.deleteOne({ userid: token.userid }, function (err) {
          if (err) {
            return res.status(400).json({ error: err });
          } else {
            return res
              .status(200)
              .json({ success: "Logged Out Successfully." });
          }
        });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
module.exports = router;
