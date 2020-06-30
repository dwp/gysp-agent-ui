const gulp = require('gulp');
const gulpFile = require('./gulpfile.js');

gulp.series(gulpFile.default)(() => {});
process.on('SIGINT', () => {
  process.kill(process.pid, 'SIGTERM');
  process.exit();
});
