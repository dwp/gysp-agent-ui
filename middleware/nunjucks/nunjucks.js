
const nunjucks = require('nunjucks');

module.exports = (app, viewDirs = []) => {
  nunjucks.configure(viewDirs, {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    express: app,
    noCache: false,
  });

  app.set('view engine', 'html');
};
