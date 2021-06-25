const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { tokenSchema } = require("./model");
const Token = new mongoose.model("Token", tokenSchema);
router.delete("/logout", function (req, res) {
  Token.deleteOne({ googleId: req.body.id }, function (err, obj) {
    if (err) {
      console.log("Error");
    } else {
      req.logout();
      res.send("Logged Out");
    }
  });
});
module.exports = router;
