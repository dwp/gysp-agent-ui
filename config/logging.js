const bunyan = require('bunyan');

function returnLogger(logType, config) {
  const logConfig = {
    level: config.level,
    name: logType,
  };

  const log = bunyan.createLogger({
    name: logConfig.name,
    streams: [{
      level: logConfig.level,
      stream: {
        write: (logData) => {
          const logObject = JSON.parse(logData);
          logObject.level = bunyan.nameFromLevel[logObject.level].toUpperCase();
          process.stdout.write(`${JSON.stringify(logObject)}\n`);
        },
      },
    }],
  });

  return log;
}

module.exports = returnLogger;
