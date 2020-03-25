const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/marital-details', functions.getMaritalDetails);

module.exports = router;
