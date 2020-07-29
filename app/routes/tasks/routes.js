const express = require('express');

const router = new express.Router();
const functions = require('./functions');

router.route('/')
  .get(functions.getTasks)
  .post(functions.postTasks);
router.get('/task', functions.getTask);
router.get('/task/detail', functions.getTaskDetail);
router.get('/task/complete', functions.getTaskComplete);
router.get('/task/end', functions.getEndTask);
router.get('/task/return-to-queue', functions.getReturnTaskToQueue);

router.use('/task/consider-entitlement', require('./entitlement/routes'));

module.exports = router;
