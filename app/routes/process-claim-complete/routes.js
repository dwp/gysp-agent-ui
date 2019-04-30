const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/complete', functions.getProcessClaimComplete);

module.exports = router;
