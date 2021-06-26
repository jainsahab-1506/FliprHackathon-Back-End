const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { tokenSchema } = require("../model");
const Token = new mongoose.model("Token", tokenSchema);
router.delete("/logout", function (req, res) {
  Token.deleteOne({ userid: req.body.id }, function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      req.logout();
      return res.status(200).json({ success: "Logged Out Successfully." });
    }
  });
});
module.exports = router;
