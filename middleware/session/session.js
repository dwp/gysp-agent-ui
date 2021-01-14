const expressSession = require('express-session');
const redisClient = require('./redis');

module.exports = (log, config, redisConfig) => {
  const sessionConfig = {
    secret: config.secret,
    name: config.name,
    cookie: {
      maxAge: config.timeout,
      secure: config.cookies.secure,
    },
    resave: true,
    rolling: true,
    saveUninitialized: true,
  };

  if (config.store === 'redis') {
    sessionConfig.store = redisClient(expressSession, redisConfig);
    sessionConfig.store.client.on('error', (err) => {
      log.error(`Redis error: ${err}`);
    });
  }

  return expressSession(sessionConfig);
};
