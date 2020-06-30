const bunyan = require('bunyan');

function returnLogger(logType, config) {
  const logConfig = {
    level: config.level,
    name: logType,
  };

  const log = bunyan.createLogger({
    name: logConfig.name,
    streams: [{ level: logConfig.level, stream: process.stdout }],
  });

  return log;
}

module.exports = returnLogger;
