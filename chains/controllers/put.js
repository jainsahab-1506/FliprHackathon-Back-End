const Chain = require("./../model");
const editchain = (req, res) => {
  console.log("called");
  const id = req.params.id;
  const chaindata = {
    chainname: req.body.chainname,
    userid: req.body.userid,
    emailgroupid: req.body.emailgroupid,
    message: req.body.message,
    frequency: req.body.frequency,
  };
  Chain.findOneAndUpdate(
    { _id: id },
    chaindata,
    { new: true, omitUndefined: true, runValidators: true },
    function (err, updatedchain) {
      if (err) {
        res.send(err);
      } else {
        res.send(updatedchain);
      }
    }
  );
};
module.exports = editchain;
