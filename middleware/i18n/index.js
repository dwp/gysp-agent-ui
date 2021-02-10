const i18next = require('i18next');
const i18nextHttpMiddleware = require('i18next-http-middleware');
const i18nextFsBackend = require('i18next-fs-backend');

const i18n = require('./i18n');

module.exports = (app, i18nextConfig, log) => {
  i18next
    .use(i18nextFsBackend)
    .init(i18nextConfig);

  app.use(i18nextHttpMiddleware.handle(i18next, { ignoreRoutes: ['/assets'] }));

  app.use(i18n(log));

  return i18next;
};
