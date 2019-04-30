const del = require('del'); // eslint-disable-line import/no-extraneous-dependencies

function publicFolder() {
  return del(['public']);
}

function imagesFolder() {
  return del(['public/assets/images']);
}

exports.publicFolder = publicFolder;
exports.imagesFolder = imagesFolder;
exports.default = publicFolder;
