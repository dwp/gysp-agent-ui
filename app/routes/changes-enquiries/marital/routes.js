const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/marital-details', functions.getMaritalDetails);

router.route('/marital-details/status')
  .get(functions.getChangeMaritalStatus)
  .post(functions.postChangeMaritalStatus);

router.route('/marital-details/date')
  .get(functions.getChangeMaritalDate)
  .post(functions.postChangeMaritalDate);

router.route('/marital-details/nino')
  .get(functions.getChangePartnerNino)
  .post(functions.postChangePartnerNino);

module.exports = router;
