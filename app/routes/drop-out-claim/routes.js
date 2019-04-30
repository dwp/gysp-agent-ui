const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/drop-out', functions.getDropOut);

router.get('/drop-out/details', functions.getDropOutDetails);
router.post('/drop-out/details', functions.postDropOutClaimDownloadPdf);

router.post('/drop-out/details/update-status', functions.postDropOutClaimUpdateStatus);

module.exports = router;
