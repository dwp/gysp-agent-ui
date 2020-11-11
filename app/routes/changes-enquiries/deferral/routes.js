const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/deferral/date-request-received')
  .get(functions.getDateRequestReceived)
  .post(functions.postDateRequestReceived);

router.route('/deferral/deferral-date')
  .get(functions.getDefaultDate)
  .post(functions.postDefaultDate);

router.route('/deferral/from-date')
  .get(functions.getFromDate)
  .post(functions.postFromDate);

router.route('/deferral/confirm')
  .get(functions.getConfirm);

router.route('/deferral/update')
  .get(functions.getUpdate);

module.exports = router;
