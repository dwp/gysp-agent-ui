const { src, dest, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery-autotab/js/jquery.autotab.js',
    'node_modules/govuk-frontend/govuk/all.js',
    'node_modules/accessible-autocomplete/dist/accessible-autocomplete.min.js',
    'app/assets/javascripts/application.js',
  ])
    .pipe(concat('app.js'))
    .pipe(uglify({
      compress: { hoist_funs: false },
    }))
    .pipe(dest('public/javascripts'));
}

function shiv() {
  return src('node_modules/html5shiv/dist/html5shiv.js')
    .pipe(uglify())
    .pipe(dest('public/javascripts'));
}

exports.default = parallel(scripts, shiv);
