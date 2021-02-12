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

router.route('/marital-details/first-name')
  .get(functions.getChangeName('first-name'))
  .post(functions.postChangeName('first-name'));

router.route('/marital-details/last-name')
  .get(functions.getChangeName('last-name'))
  .post(functions.postChangeName('last-name'));

router.route('/marital-details/date-of-birth')
  .get(functions.getPartnerDateOfBirth)
  .post(functions.postPartnerDateOfBirth);

router.route('/marital-details/nino')
  .get(functions.getChangePartnerNino)
  .post(functions.postChangePartnerNino);

router.route(/\/marital-details\/(spouse|partner)-details/)
  .get(functions.getPartnerDetails)
  .post(functions.postPartnerDetails);

router.route('/marital-details/check-for-inheritable-state-pension')
  .get(functions.getCheckForInheritableStatePension)
  .post(functions.postCheckForInheritableStatePension);

router.route('/marital-details/consider-state-pension-entitlement')
  .get(functions.getConsiderStatePensionEntitlement);

router.route('/marital-details/entitled-to-any-inherited-state-pension')
  .get(functions.getEntitledToInheritedStatePension)
  .post(functions.postEntitledToInheritedStatePension);

router.route('/marital-details/relevant-inherited-amounts')
  .get(functions.getRelevantInheritedAmounts)
  .post(functions.postRelevantInheritedAmounts);

router.route('/marital-details/update-state-pension-award')
  .get(functions.getUpdateStatePensionAward)
  .post(functions.postUpdateStatePensionAward);

router.route('/marital-details/update-state-pension-award/:type(new-state-pension|protected-payment|inherited-extra-state-pension)')
  .get(functions.getUpdateStatePensionAwardAmount)
  .post(functions.postUpdateStatePensionAwardAmount);

router.route('/marital-details/update-and-send-letter')
  .get(functions.getUpdateAndSendLetter)
  .post(functions.postUpdateAndSendLetter);

router.route('/marital-details/send-letter')
  .get(functions.getSendLetter)
  .post(functions.postSendLetter);

router.route('/marital-details/save-and-create-task')
  .get(functions.getSaveMaritalDetails)
  .post(functions.postSaveMaritalDetails);

module.exports = router;
