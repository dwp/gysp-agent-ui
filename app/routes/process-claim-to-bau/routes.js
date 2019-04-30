const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/all-claims-to-bau', functions.getAllClaimsToBau);
router.get('/claim-to-bau', functions.getClaimToBau);

module.exports = router;
