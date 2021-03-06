const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.use('/personal/death', require('./can-verify-date/routes'));

router.route('/personal/death')
  .get(functions.getAddDateDeath)
  .post(functions.postAddDateDeath);

router.route('/personal/death/enter-person-dealing-with-the-estate-details')
  .get(functions.getRedirectToDapDetails);

router.route('/personal/death/name')
  .get(functions.getDapName)
  .post(functions.postDapName);

router.route('/personal/death/address')
  .get(functions.getDapPostcodeLookup)
  .post(functions.postDapPostcodeLookup);

router.route('/personal/death/address-select')
  .get(functions.getDapAddressSelect)
  .post(functions.postDapAddressSelect);

router.route('/personal/death/phone-number')
  .get(functions.getDapPhoneNumber)
  .post(functions.postDapPhoneNumber);

router.route('/personal/death/payment')
  .get(functions.getDeathPayment);

router.route('/personal/death/check-details')
  .get(functions.getCheckDetails);

router.route('/personal/death/record')
  .get(functions.getRecordDeath);

router.route('/personal/death/verify')
  .get(functions.getVerifyDeath)
  .post(functions.postVerifyDeath);

router.route('/personal/death/verified-date')
  .get(functions.getAddVerifiedDeath)
  .post(functions.postAddVerifiedDeath);

router.route('/personal/death/retry-calculation')
  .get(functions.getRetryCalculation);

router.route('/personal/death/update')
  .get(functions.getUpdateDeath);

router.route('/personal/death/review-payee')
  .get(functions.getReviewPayeeDetails);

module.exports = router;
