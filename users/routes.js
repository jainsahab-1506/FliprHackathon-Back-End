const router = require("express").Router();
const edituser = require("./controllers/update.js");
const getcred = require("./controllers/getmailcred.js");
router.put("/:ownerid", edituser);
router.get("/:id/:ownerid", getcred);
module.exports = router;
