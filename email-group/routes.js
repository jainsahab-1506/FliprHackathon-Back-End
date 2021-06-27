const router = require('express').Router();

const createEmailGroup = require('./controllers/create.js');
const deleteEmailGroup = require('./controllers/delete.js');
const editEmailGroup = require('./controllers/edit.js');
const getEmailGroup = require('./controllers/get.js');

router.delete('/:id', deleteEmailGroup);
router.get('/:id?', getEmailGroup);
router.post('/', createEmailGroup);
router.put('/', editEmailGroup);

module.exports = router;
