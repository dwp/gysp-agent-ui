const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment/schedule', functions.getPaymentSchedule);

module.exports = router;
