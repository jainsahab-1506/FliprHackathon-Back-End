const router = require("express").Router();
const edituser = require("./controllers/update.js");
router.put("/", edituser);
module.exports = router;
