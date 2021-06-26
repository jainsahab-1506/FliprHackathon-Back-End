const mongoose = require("mongoose");

const EmailGroup = require("./../model");
const { userSchema } = require("../../model");

const User = new mongoose.model("User", userSchema);

const createEmailGroup = async (req, res) => {
  try {
    const emailGroupData = req.body;

    const ownerId = emailGroupData.owner;
    const owner = await User.find({ _id: ownerId });
    if (!owner) {
      return res.status(400).json({
        error:
          "No such user exists. Cannot create an email group without a valid owner.",
      });
    }

    const emailGroup = await EmailGroup.create(emailGroupData);
    if (!emailGroup) {
      return res
        .status(400)
        .json({ error: "Unable to create a new email group." });
    }

    return res.status(200).json(emailGroup);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = createEmailGroup;
