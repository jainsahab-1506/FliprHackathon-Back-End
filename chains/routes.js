const router = require("express").Router();

const createchain = require("./controllers/post.js");
const deletechain = require("./controllers/delete.js");
const editchain = require("./controllers/put.js");
const getchains = require("./controllers/get.js");

router.delete("/:id/:ownerid", deletechain);
router.get("/:id", getchains);
router.post("/:ownerid", createchain);
router.put("/:id/:ownerid", editchain);

module.exports = router;
