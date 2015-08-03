var gulp = require('gulp')
  , sass = require('gulp-sass')
  , postcss      = require('gulp-postcss')
  , autoprefixer = require('autoprefixer-core')

module.exports = function() {
  gulp.src('app/scss/index.scss')
    .pipe(sass())
    .on('error', console.error)
    .pipe(postcss([ autoprefixer({ browsers: ['last 4 version'] }) ]))
    .pipe(gulp.dest('public/css/'));
};

module.exports.watch = function() {
  return gulp.watch('app/scss/**/*.scss', ['sass']);
};
