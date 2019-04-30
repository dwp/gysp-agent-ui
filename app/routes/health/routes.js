const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/health', functions.endPoint);

module.exports = router;
