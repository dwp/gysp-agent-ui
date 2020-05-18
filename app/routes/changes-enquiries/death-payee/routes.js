const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/personal/death/payee-details')
  .get(functions.getCheckPayeeDetails);

router.route('/personal/death/payee-details/name')
  .get(functions.getPayeeName)
  .post(functions.postPayeeName);

router.route('/personal/death/payee-details/phone-number')
  .get(functions.getPayeePhoneNumber)
  .post(functions.postPayeePhoneNumber);

router.route('/personal/death/payee-details/address')
  .get(functions.getPayeePostcodeLookup)
  .post(functions.postPayeePostcodeLookup);

router.route('/personal/death/payee-details/address-select')
  .get(functions.getPayeeAddressSelect)
  .post(functions.postPayeeAddressSelect);

router.route('/personal/death/account-details')
  .get(functions.getAccountDetails)
  .post(functions.postAccountDetails);

router.route('/personal/death/payee-arrears')
  .get(functions.getPayArrears);

router.route('/personal/death/process-arrears')
  .get(functions.getProcessArrears);

module.exports = router;
