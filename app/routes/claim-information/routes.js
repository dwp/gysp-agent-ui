const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getClaimInformation);
router.post('/', functions.postClaimInformation);

module.exports = router;
