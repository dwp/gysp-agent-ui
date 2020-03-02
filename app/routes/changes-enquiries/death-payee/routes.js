const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/personal/death/payee-details')
  .get(functions.getCheckPayeeDetails);

router.route('/personal/death/account-details')
  .get(functions.getAccountDetails)
  .post(functions.postAccountDetails);

router.route('/personal/death/payee-arrears')
  .get(functions.getPayArrears);

router.route('/personal/death/process-arrears')
  .get(functions.getProcessArrears);

module.exports = router;
