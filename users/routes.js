const router = require("express").Router();
const edituser = require("./controllers/update.js");
router.put("/:ownerid", edituser);
module.exports = router;
