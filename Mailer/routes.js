const router = require("express").Router();

const domail = require("./Controllers/mail.js");

router.post("/:id", domail);
module.exports = router;
