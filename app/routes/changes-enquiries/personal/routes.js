const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/personal', functions.getPersonalDetails);

router.use('/personal', require('../deferral/routes'));
router.use('/personal', require('../stop-state-pension/routes'));

module.exports = router;
