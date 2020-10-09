const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/manual-payment/details')
  .get(functions.getDetails)
  .post(functions.postDetails);

router.route('/manual-payment/confirm')
  .get(functions.getConfirm);

router.route('/manual-payment/update')
  .get(functions.getUpdate);

module.exports = router;
