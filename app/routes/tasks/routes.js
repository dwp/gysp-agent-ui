const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.get('/', functions.getTasks);
router.get('/task', functions.getTask);
router.get('/task/detail', functions.getTaskDetail);
router.get('/task/complete', functions.getTaskComplete);
router.get('/task/end', functions.getEndTask);
router.get('/task/return-to-queue', functions.getReturnTaskToQueue);

module.exports = router;
