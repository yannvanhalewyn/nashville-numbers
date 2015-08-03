var gulp = require('gulp')
  , livereload = require('gulp-livereload')

module.exports = function() {
  return gulp.watch('./public/css/*.css', function(file) {
    gulp.src(file.path).pipe(livereload({start: true}));
  });
}
