const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/personal/death')
  .get(functions.getAddDateDeath)
  .post(functions.postAddDateDeath);

router.route('/personal/death/verify')
  .get(functions.getVerifyDeath)
  .post(functions.postVerifyDeath);

router.route('/personal/death/verified-date')
  .get(functions.getAddVerifedDeath)
  .post(functions.postAddVerifedDeath);

module.exports = router;
