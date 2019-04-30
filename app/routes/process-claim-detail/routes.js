const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/detail', functions.getProcessClaimDetailCache);

module.exports = router;
