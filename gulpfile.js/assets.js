const { series, parallel } = require('gulp');
const clean = require('./clean');
const copy = require('./copy');
const sass = require('./sass');
const scripts = require('./scripts');

exports.default = series(clean.default, parallel(copy.default, sass.default, scripts.default));
