const router = require('express').Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { createchain, authorizeRequest } = require('./controllers/post.js');
const deletechain = require('./controllers/delete.js');
const editchain = require('./controllers/put.js');
const getchains = require('./controllers/get.js');

router.delete('/:id/:ownerid', deletechain);
router.get('/:id', getchains);
router.post('/:ownerid', authorizeRequest, upload.array('files'), createchain);
router.put('/:id/:ownerid', editchain);

module.exports = router;
