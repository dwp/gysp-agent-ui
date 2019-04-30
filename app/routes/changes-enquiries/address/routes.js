const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/address', functions.getPostcodeLookup);
router.post('/address', functions.postPostcodeLookup);

router.get('/address/select', functions.getSelectAddress);
router.post('/address/select', functions.postSelectAddress);

module.exports = router;
