const mongoose = require("mongoose");

const EmailGroup = require("../model");
const { userSchema } = require("../../model");

const User = new mongoose.model("User", userSchema);

const getEmailGroup = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const owner = await User.find({ _id: ownerId });
    if (!owner) {
      return res.status(400).json({
        error:
          "No such user exists. Cannot show email groups without a valid owner.",
      });
    }

    const emailGroups = await EmailGroup.find({ owner: ownerId });

    return res.status(200).json(emailGroups);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = getEmailGroup;
