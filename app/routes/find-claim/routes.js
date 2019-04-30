const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getFindClaim);
router.post('/', functions.postFindClaim);

router.post('/pdf', functions.downloadPdf);
router.post('/update', functions.updateStatus);

module.exports = router;
