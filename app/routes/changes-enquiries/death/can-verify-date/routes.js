const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/are-you-able-to-verify-the-date-of-death')
  .get(functions.getCanVerifyDateOfDeath)
  .post(functions.postCanVerifyDateOfDeath);

module.exports = router;
