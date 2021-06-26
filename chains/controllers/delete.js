const Chain = require("./../model");
const deletechain = (req, res) => {
  const id = req.params.id;
  Chain.deleteOne({ _id: id }, function (err) {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete",
      });
    } else {
      return res.status(200).json({ success: "Chain Successfully Deleted." });
    }
  });
};
module.exports = deletechain;
