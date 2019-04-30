const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/overview', functions.getOverview);

module.exports = router;
