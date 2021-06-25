const Chain = require("./../model");
const getchains = (req, res) => {
  const id = req.params.id;
  Chain.find({ userid: id }, function (err, chains) {
    if (err) {
      res.send(err);
    } else {
      res.send(chains);
    }
  });
};
module.exports = getchains;
