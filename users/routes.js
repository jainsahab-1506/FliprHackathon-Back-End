const router = require("express").Router();
const edituser = require("./controllers/update.js");
const getcred = require("./controllers/getmailcred.js");
router.put("/", edituser);
router.get("/:id", getcred);
module.exports = router;
