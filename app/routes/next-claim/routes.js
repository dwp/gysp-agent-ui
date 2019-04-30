const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/next-claim', functions.getClaim);
router.post('/next-claim', functions.postClaim);

router.post('/next-claim/download', functions.getDownloadPdf);
module.exports = router;
