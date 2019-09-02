const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment-history/:id', functions.getPaymentHistoryDetail);

module.exports = router;
