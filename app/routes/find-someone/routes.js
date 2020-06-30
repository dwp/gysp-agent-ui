const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getFindSomeone);
router.post('/', functions.postFindSomeone);
router.get('/search-result', functions.getSearchResult);

module.exports = router;
