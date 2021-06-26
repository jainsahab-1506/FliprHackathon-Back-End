const mongoose = require("mongoose");
const { userSchema, tokenSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);

const Token = new mongoose.model("Token", tokenSchema);
const updateuser = (req, res) => {
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

        const newuser = {
          firstName: req.body.firstName,
          lastName: req.body.LastName,
          googleId: req.body.googleId,
          email: req.body.email,
          password: req.body.password ? req.body.password : "",
          mailCredentialsId: req.body.mailCredentialsId
            ? req.body.mailCredentialsId
            : "",
          username: req.body.username,
          verified: req.body.mailCredentialsId ? true : false,
        };
        User.findOneAndUpdate(
          { _id: tokenOwner },
          newuser,
          { new: true, omitUndefined: true, runValidators: true },
          function (err, updateduser) {
            if (err) {
              res.send(err);
            } else {
              res.send(updateduser);
            }
          }
        );
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = updateuser;
