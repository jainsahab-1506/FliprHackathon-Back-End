const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { chainSchema } = require("./model");
const Chain = new mongoose.model("Token", chainSchema);
router.get("/getChains/:id", function (req, res) {
  const id = req.params.id;
  Chain.find({ userid: id }, function (err, chains) {
    if (err) {
      res.send(err);
    } else {
      res.send(chains);
    }
  });
});

router.post("/createChain/:id", function (req, res) {
  const chaindata = new Chain({
    chainname: req.body.chainName,
    userid: req.params.id,
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
});

router.put("/updatechain/:id", function (req, res) {
  const id = req.params.id;
  const chaindata = {
    chainname: req.body.chainName,
    userid: req.body.id,
    emailgroupid: req.body.emailgroupid,
    message: req.body.message,
    frequency: req.body.frequency,
  };
  Chain.findOneandUpdate(
    { _id: id },
    chaindata,
    { new: true, omitUndefined: true, runValidators: true },
    function (err, updatedchain) {
      if (err) {
        res.send("Error");
      } else {
        res.send(updatedchain);
      }
    }
  );
});

router.put("/deletechain/:id", function (req, res) {
  const id = req.params.id;
  Chain.deleteOne({ _id: id }, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Object Has been Deleted");
    }
  });
});
