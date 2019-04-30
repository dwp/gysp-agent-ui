const nodemon = require('gulp-nodemon'); // eslint-disable-line import/no-extraneous-dependencies

function watchNodemon(cb) {
  let started = false;
  return nodemon({
    script: 'server.js',
    ext: 'js, json, yaml, html',
    ignore: ['node_modules/', 'app/assets/', 'public/'],
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
}

exports.default = watchNodemon;
