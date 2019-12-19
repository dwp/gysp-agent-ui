const { src, dest, series } = require('gulp');
const tar = require('gulp-tar');
const rename = require('gulp-rename');
const fs = require('fs');

const packageJson = require('./package.json');

function renamePackage(cb) {
  fs.rename('./build.tar', `./${packageJson.name}-${packageJson.snapshot}.tar`, (err) => {
    if (err) {
      throw err;
    }
  });
  cb();
}

function build() {
  return src([
    'node_modules/**/*',
    'public/**/*',
    'config/**',
    'bin/**',
    'app/**',
    'lib/**',
    'locales/**',
    'logs',
    'package.json',
    '*.js',
    '!app/assets/**',
    '!gulpfile.js/**',
    '!start.js',
    '!awsPrivateIp.js',
    '!gulpfile.js',
    '!gulp-package.js',
    '!config/*.yaml',
    '!node_modules/gulp*{,/**/*}',
  ], { base: './' })
    .pipe(rename((path) => { // eslint-disable-line no-shadow
      path.dirname = `agent-ui/${path.dirname}`; // eslint-disable-line no-param-reassign
    }))
    .pipe(tar('build.tar'))
    .pipe(dest('./'));
}

exports.default = series(build, renamePackage);
