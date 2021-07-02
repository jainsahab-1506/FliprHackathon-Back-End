const router = require("express").Router();

const { createchain, authorizeRequest } = require("./controllers/post.js");
const deletechain = require("./controllers/delete.js");
const { editchain, authorizeUpdate } = require("./controllers/put.js");
const getchains = require("./controllers/get.js");
const getmessage = require("./controllers/get.js");

router.get("/:id", getmessage);
router.delete("/:id", deletechain);
router.get("/:id?", getchains);
router.post("/", authorizeRequest, createchain);
router.put("/:id", authorizeUpdate, editchain);

module.exports = router;
