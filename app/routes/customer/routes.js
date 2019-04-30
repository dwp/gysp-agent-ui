const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/add', functions.customerAddGetCache);
router.post('/add', functions.customerAddPostCache);

module.exports = router;
