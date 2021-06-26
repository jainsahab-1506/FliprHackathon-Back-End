const router = require("express").Router();

const getmessage = require("./controllers/get.js");

router.get("/:id/:ownerid", getmessage);

module.exports = router;
