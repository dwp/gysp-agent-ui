const { series } = require('gulp');
const watch = require('./watch');
const nodemon = require('./nodemon');
const assets = require('./assets');

exports.generateAssets = assets.default;
exports.default = series(watch.default, nodemon.default);
