const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/payment-history/:id', functions.getPaymentHistoryDetail);
router.route('/payment-history/:id/status-update')
  .get(functions.getStatusUpdate)
  .post(functions.postStatusUpdate);

router.route('/payment-history/:id/reissue')
  .get(functions.getReissuePayment)
  .post(functions.postReissuePayment);

module.exports = router;
