const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment', functions.getPaymentOverview);

router.use('/payment', require('../manual-payment/routes'));

module.exports = router;
