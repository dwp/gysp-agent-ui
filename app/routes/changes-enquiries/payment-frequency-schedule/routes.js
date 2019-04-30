const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment/frequency/schedule', functions.getChangePaymentFrequency)
  .post('/payment/frequency/schedule', functions.postChangePaymentFrequency);

module.exports = router;
