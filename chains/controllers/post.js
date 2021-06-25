const Chain = require("./../model");
const createchain = (req, res) => {
  const chaindata = new Chain({
    chainname: req.body.chainname,
    userid: req.body.userid,
    emailgroupid: req.body.emailgroupid,
    message: req.body.message,
    frequency: req.body.frequency,
  });
  chaindata.save(function (err, chainsaved) {
    if (err) {
      res.send(err);
    } else {
      res.send(chainsaved);
    }
  });
};
module.exports = createchain;
