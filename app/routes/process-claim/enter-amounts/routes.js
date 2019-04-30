const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/enter-amounts', functions.getEnterAmounts);
router.post('/enter-amounts', functions.postEnterAmounts);

module.exports = router;
