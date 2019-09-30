
const express = require('express');

const router = new express.Router();

router.use('/', require('./account/routes'));
router.use('/', require('./address/routes'));
router.use('/award', require('./award/routes'));
router.use('/', require('./contact/routes.js'));
router.use('/', require('./death/routes'));
router.use('/', require('./personal/routes.js'));
router.use('/', require('./payment/routes'));
router.use('/', require('./payment-frequency/routes'));
router.use('/', require('./payment-frequency-schedule/routes'));
router.use('/', require('./payment-history/routes'));
router.use('/', require('./payment-schedule/routes'));

module.exports = router;
