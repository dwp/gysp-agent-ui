const { src, dest } = require('gulp');

function copyImages() {
  return src('app/assets/images/**')
    .pipe(dest('public/images/'));
}

exports.default = copyImages;
