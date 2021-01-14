const flash = require('express-flash');

const session = require('./session');

module.exports = (app, log, config) => {
  const {
    redis: redisConfig,
    session: sessionConfig,
  } = config;
  app.use(session(log, sessionConfig, redisConfig));
  app.use(flash());
};
