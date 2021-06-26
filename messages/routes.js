const router = require("express").Router();

const getmessage = require("./controllers/get.js");

router.get("/:id", getmessage);

module.exports = router;
