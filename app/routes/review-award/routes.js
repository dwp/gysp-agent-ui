const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getReviewAward);

module.exports = router;
