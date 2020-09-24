const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.landingPage);
router.get('/accessibility-statement', functions.accessibilityStatement);

router.all('/endpoint', (req, res) => {
  res.status(200).send({ status: 'okay' });
});

router.all('/api/claim', (req, res) => {
  res.status(200).send([]);
});

router.all('/api/customer', (req, res) => {
  res.status(200).send({ inviteKey: 'kitten' });
});

module.exports = router;
