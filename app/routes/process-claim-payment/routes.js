const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment', functions.getProcessClaimPayment);
router.post('/payment', functions.postProcessClaimPayment);

module.exports = router;
