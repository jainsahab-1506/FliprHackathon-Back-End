const router = require("express").Router();

const domail = require("./Controllers/mail.js");
const cronjob = require("./Controllers/cronjob.js");

router.post("/mailer/:id", domail);
router.post("/cronjob/:id", cronjob);
module.exports = router;
