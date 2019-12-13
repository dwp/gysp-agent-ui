const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/reset', functions.getMockResetDate);
router.get('/:datetime', functions.getMockSetDate);

module.exports = router;
