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

router.route('/marital-details/date-of-birth')
  .get(functions.getPartnerDateOfBirth)
  .post(functions.postPartnerDateOfBirth);

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

router.route('/marital-details/save-and-create-task')
  .get(functions.getSaveMaritalDetails)
  .post(functions.postSaveMaritalDetails);

module.exports = router;
