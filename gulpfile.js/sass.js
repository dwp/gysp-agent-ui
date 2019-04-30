const { series, src, dest } = require('gulp');
const sass = require('gulp-sass'); // eslint-disable-line import/no-extraneous-dependencies
const cleanCSS = require('gulp-clean-css'); // eslint-disable-line import/no-extraneous-dependencies
const plumber = require('gulp-plumber'); // eslint-disable-line import/no-extraneous-dependencies
const sassLint = require('./sass-lint');

function buildSass() {
  return src([
    'app/assets/sass/**/*.scss',
  ])
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      sourcemap: true,
      includePaths: [
        'node_modules/govuk-frontend',
      ],
    }))
    .pipe(cleanCSS())
    .pipe(dest('public/stylesheets/'));
}

exports.default = series(sassLint.default, buildSass);
