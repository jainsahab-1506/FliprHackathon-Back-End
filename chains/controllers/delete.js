const Chain = require("./../model");
const deletechain = (req, res) => {
  const id = req.params.id;
  Chain.deleteOne({ _id: id }, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Object Has been Deleted");
    }
  });
};
module.exports = deletechain;
