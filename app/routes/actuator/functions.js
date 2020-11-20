const packageJson = require('../../../package.json');

function getHealth(req, res) {
  res.status(200).json({
    status: 'UP',
  });
}

function getInfo(req, res) {
  res.status(200).json({
    app: {
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
    node: {
      version: process.versions.node,
    },
  });
}

function getMetrics(req, res) {
  res.status(200).json({
    uptime: process.uptime(),
  });
}

function getPrometheus(metricsClient) {
  return (req, res) => {
    res.set('Content-Type', metricsClient.register.contentType);
    res.send(metricsClient.register.metrics());
  };
}

module.exports = {
  getHealth,
  getInfo,
  getMetrics,
  getPrometheus,
};
