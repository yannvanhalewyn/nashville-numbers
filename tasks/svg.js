var gulp     = require('gulp')
  , svgstore = require('gulp-svgstore')
  , svgmin   = require('gulp-svgmin')
  , rename   = require('gulp-rename')

var svgGlob = "app/svg/*.svg";

module.exports = function() {
  return gulp.src(svgGlob)
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename("svgstore.handlebars"))
    .pipe(gulp.dest("views/partials"));
}

module.exports.watch = function() {
  return gulp.watch(svgGlob, ['svg']);
}
