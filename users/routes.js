const router = require("express").Router();
const edituser = require("./controllers/update.js");
const getcred = require("./controllers/getmailcred.js");
router.put("/", edituser);
router.get("/getcred", getcred);
module.exports = router;
