const Chain = require("./../model");
const createchain = (req, res) => {
  User.find({ _id: req.body.userid }, function (owner) {
    if (!owner) {
      return res.status(400).json({
        error: "No such user exists. Cannot show Chains without a valid owner.",
      });
    }
    const chaindata = new Chain({
      chainname: req.body.chainname,
      userid: req.body.userid,
      emailgroupid: req.body.emailgroupid,
      message: req.body.message,
      frequency: req.body.frequency,
      status: false,
    });
    chaindata.save(function (err, chainsaved) {
      if (err) {
        return res.status(400).json({
          error: { err },
        });
      } else {
        return res.status(200).json({ success: "Chain Created.", chainsaved });
      }
    });
  });
};
module.exports = createchain;
