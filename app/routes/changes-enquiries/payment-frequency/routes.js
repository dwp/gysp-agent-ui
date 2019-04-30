const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment/frequency', functions.getChangePaymentFrequency);
router.post('/payment/frequency', functions.postChangePaymentFrequency);

module.exports = router;
