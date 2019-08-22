const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getReviewAward);
router.get('/reason', functions.getReviewReason);
router.get('/new-award', functions.getNewAward);
router.route('/schedule')
  .get(functions.getPaymentSchedule)
  .post(functions.postPaymentSchedule);
router.get('/complete', functions.getComplete);

module.exports = router;
