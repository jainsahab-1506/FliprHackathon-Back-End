const { Chain, Messages } = require("./../model");
const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const axios = require("axios");
const Token = new mongoose.model("Token", tokenSchema);
const deletechain = (req, res) => {
  try {
    const id = req.params.id;
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
        try {
          const chain = await Chain.find({ _id: id });
          if (chain.userid.toString() !== token.userid.toString()) {
            return res
              .status(400)
              .json("Error:You are not Authorized to delete");
          }
          await Chain.deleteOne({ _id: id });
          const resp = await axios({
            method: "Delete",
            url: process.env.SERVER_URL1 + "/deletecron/" + id,
            headers: {
              Authorization: "Bearer " + tokenData,
            },
          });
          return res
            .status(200)
            .json({ success: "Chain Successfully Deleted." });
        } catch (err) {
          return res.status(400).json({
            error: "Unable to delete",
          });
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = deletechain;
