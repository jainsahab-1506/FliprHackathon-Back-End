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
    status: req.body.status,
  };
  Chain.findOneAndUpdate(
    { _id: id },
    chaindata,
    { new: true, omitUndefined: true, runValidators: true },
    function (err, updatedchain) {
      if (err) {
        return res.status(400).json({
          error: "Cannot Update Chain",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Chain Updated.", updatedchain });
      }
    }
  );
};
module.exports = editchain;
