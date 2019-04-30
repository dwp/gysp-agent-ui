const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment/account', functions.getChangeBankBuildingAccountDetails);
router.post('/payment/account', functions.postChangeBankBuildingAccountDetails);

module.exports = router;
