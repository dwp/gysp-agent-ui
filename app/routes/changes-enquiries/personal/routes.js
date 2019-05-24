const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/personal', functions.getPersonalDetails);

module.exports = router;
