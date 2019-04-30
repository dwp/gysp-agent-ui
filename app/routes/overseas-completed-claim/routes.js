const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/overseas/completed-claim', functions.getOverseasCompletedClaim);
router.get('/overseas/completed-claim/details', functions.getOverseasCompletedClaimDetails);
router.post('/overseas/completed-claim/details', functions.postOverseasCompletedClaimDownloadPdf);
router.post('/overseas/completed-claim/details/update-status', functions.postOverseasCompletedClaimUpdateStatus);

module.exports = router;
