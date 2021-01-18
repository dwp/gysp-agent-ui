const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/name-change')
  .get(functions.getNameChange)
  .post(functions.postNameChange);

module.exports = router;
