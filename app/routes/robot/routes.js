const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/next-claim', functions.getClaim);
router.post('/next-claim', functions.postClaim);

router.get('/claim-in-error', functions.getClaimInError);
router.post('/claim-in-error', functions.postClaimInError);

module.exports = router;
