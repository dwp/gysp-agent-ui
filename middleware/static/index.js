const serveStatic = require('./static');

module.exports = (args) => {
  const {
    app,
    npmGovukFrontend,
    maxAge = 3600000,
    mountUrl = '/',
  } = args;

  serveStatic({
    app,
    npmGovukFrontend,
    maxAge,
    mountUrl,
  });
};
