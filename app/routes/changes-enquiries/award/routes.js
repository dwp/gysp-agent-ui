const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getAwardList);
router.get('/:id', functions.getAwardDetails);

module.exports = router;
