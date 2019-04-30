const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/contact/:type(home|work|mobile|email)', functions.getChangeContactDetails);
router.post('/contact/:type(home|work|mobile|email)', functions.postChangeContactDetails);
router.get('/contact/remove/:type(home|work|mobile|email)', functions.getRemoveContactDetails);
router.post('/contact/remove/:type(home|work|mobile|email)', functions.postRemoveContactDetails);

module.exports = router;
