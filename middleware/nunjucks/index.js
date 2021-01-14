const nunjucks = require('./nunjucks');

module.exports = (app, viewDirs = []) => {
  nunjucks(app, viewDirs);
};
