const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getTasks);
router.get('/task', functions.getTask);

module.exports = router;
