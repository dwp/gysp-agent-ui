const express = require('express');
const responseTime = require('response-time');

const router = new express.Router();
const functions = require('./functions');
const { client, requestCount, requestDuration } = require('../../../lib/prometheusClient');

// Set up response time and prometheus reporting
router.use(responseTime((req, res, time) => {
  res.once('finish', () => {
    const { path: route, method } = req;
    const { statusCode: status } = res;

    requestCount.inc({ route, method, status });
    requestDuration.labels(route, method, status).observe(time / 1000);
  });
}));

router.get('/health', functions.getHealth);
router.get('/info', functions.getInfo);
router.get('/metrics', functions.getMetrics);
router.get('/prometheus', functions.getPrometheus(client));

module.exports = router;
