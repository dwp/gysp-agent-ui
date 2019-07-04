const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/personal/death', functions.getAddDateDeath);
router.post('/personal/death', functions.postAddDateDeath);

module.exports = router;
