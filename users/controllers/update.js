const mongoose = require("mongoose");
const { userSchema } = require("../../model");
const User = new mongoose.model("User", userSchema);
const updateuser = (req, res) => {
  const id = req.body.id;
  const newuser = {
    firstName: req.body.firstName,
    lastName: req.body.LastName,
    googleId: req.body.googleId,
    email: req.body.email,
    password: req.body.password ? req.body.password : "",
    mailCredentials: req.body.mailCredentials ? req.body.mailCredentials : {},
    username: req.body.username,
    verified: req.body.mailCredentials ? true : false,
  };
  User.findOneAndUpdate(
    { _id: id },
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
};
module.exports = updateuser;
