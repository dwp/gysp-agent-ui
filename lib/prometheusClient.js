const client = require('prom-client');

const requestCount = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total http requests received',
  labelNames: ['route', 'method', 'status'],
});

const requestDuration = new client.Histogram({
  name: 'app_http_request_duration',
  help: 'Duration of http requests in seconds',
  labelNames: ['route', 'method', 'status'],
  buckets: [0.5, 1, 3, 5, 10],
});

client.collectDefaultMetrics();

module.exports = {
  client,
  requestCount,
  requestDuration,
};
