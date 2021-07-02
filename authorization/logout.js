const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { tokenSchema } = require("../model");
const Token = new mongoose.model("Token", tokenSchema);
router.delete("/logout", async function (req, res) {
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
        error: "Unauthorized request.",
      });
    }
    await Token.deleteOne({ token: tokenData });
    return res.status(200).json({ success: "Logged Out Successfully." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
module.exports = router;
