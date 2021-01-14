const expStatic = require('express').static;

module.exports = (args) => {
  const {
    app,
    npmGovukFrontend,
    maxAge,
    mountUrl,
  } = args;

  const mounts = [{
    url: `${mountUrl}assets`,
    path: './public',
  }, {
    url: `${mountUrl}assets`,
    path: `${npmGovukFrontend}/govuk`,
  }, {
    url: `${mountUrl}assets`,
    path: `${npmGovukFrontend}/govuk/assets`,
    maxAge: 86400000,
  }];

  mounts.forEach((mount) => {
    app.use(mount.url, expStatic(mount.path, {
      maxAge: mount.maxAge || maxAge,
    }));
  });
};
