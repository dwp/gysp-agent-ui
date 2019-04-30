const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getFindSomeone);
router.post('/', functions.postFindSomeone);

module.exports = router;
