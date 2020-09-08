const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/stop-state-pension')
  .get(functions.getStopStatePension)
  .post(functions.postStopStatePension);

module.exports = router;
