const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/address', functions.getPostcodeLookup);
router.post('/address', functions.postPostcodeLookup);

router.get('/address/select', functions.getSelectAddress);
router.post('/address/select', functions.postSelectAddress);

router.get('/address/international-address', functions.getInternationalAddress);
router.post('/address/international-address', functions.postInternationalAddress);

module.exports = router;
