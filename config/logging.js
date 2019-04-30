const RotatingFileStream = require('bunyan-rotating-file-stream');
const bunyan = require('bunyan');

function returnLogger(logType, config) {
  let logName = logType;
  if (logType === undefined) {
    logName = 'application';
  }

  const logConfig = {
    filename: `${config.path}/${logName}.log`,
    maxsize: config.size,
    maxFiles: config.backups,
    rotate: config.rotate,
    level: config.logLevel,
    name: logType,
  };

  const log = bunyan.createLogger({
    name: logConfig.name,
    streams: [
      {
        level: logConfig.level,
        stream: new RotatingFileStream({
          type: 'rotating-file',
          path: logConfig.filename,
          period: logConfig.rotate,
          threshold: logConfig.maxsize,
          count: logConfig.maxFiles,
        }),
      },
      { level: logConfig.level, stream: process.stdout },
    ],
  });

  return log;
}

module.exports = returnLogger;
