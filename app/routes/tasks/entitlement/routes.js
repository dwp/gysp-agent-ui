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

router.route('/entitled-to-any-inherited-state-pension')
  .get(functions.getEntitledToInheritedStatePension)
  .post(functions.postEntitledToInheritedStatePension);

router.route('/relevant-inherited-amounts')
  .get(functions.getRelevantInheritedAmounts)
  .post(functions.postRelevantInheritedAmounts);

router.route('/update-state-pension-award')
  .get(functions.getUpdateStatePensionAward)
  .post(functions.postUpdateStatePensionAward);

router.route('/update-state-pension-award/:type(new-state-pension|protected-payment|inherited-extra-state-pension)')
  .get(functions.getUpdateStatePensionAwardAmount)
  .post(functions.postUpdateStatePensionAwardAmount);

module.exports = router;
