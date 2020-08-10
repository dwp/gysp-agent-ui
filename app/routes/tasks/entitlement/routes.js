const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/partner-nino')
  .get(functions.getPartnerNino)
  .post(functions.postPartnerNino);

router.route('/date-of-birth')
  .get(functions.getDateOfBirth)
  .post(functions.postDateOfBirth);

router.route('/marital-date')
  .get(functions.getMaritalDate)
  .post(functions.postMaritalDate);

module.exports = router;
