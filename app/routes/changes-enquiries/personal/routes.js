const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/personal', functions.getPersonalDetails);

router.use('/personal', require('../deferral/routes'));
router.use('/personal', require('../stop-state-pension/routes'));
router.use('/personal', require('../name-change/routes'));

module.exports = router;
