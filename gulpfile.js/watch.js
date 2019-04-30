const { series, watch } = require('gulp');

const assets = require('./assets');
const sass = require('./sass');
const scripts = require('./scripts');
const copy = require('./copy');

function watchFiles(done) {
  watch('app/assets/sass/**/*.scss', series(sass.default));
  watch('app/assets/javascripts/**/*.js', series(scripts.default));
  watch('app/assets/images/**/*', series(copy.default));
  done();
}

exports.default = series(assets.default, watchFiles);
