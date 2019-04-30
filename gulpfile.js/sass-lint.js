const { src } = require('gulp');
const sassLint = require('gulp-sass-lint'); // eslint-disable-line import/no-extraneous-dependencies

function sassLinter() {
  return src('app/assets/sass/**/**.scss')
    .pipe(sassLint())
    .pipe(sassLint.format());
}

exports.default = sassLinter;
