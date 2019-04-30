const express = require('express');

const router = new express.Router();

function landingPage(req, res) {
  res.render('pages/landing');
}

router.get('/', landingPage);

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
