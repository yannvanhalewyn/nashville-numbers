'use strict';

var watchify   = require('watchify');
var browserify = require('browserify');
var reactify   = require('reactify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var gutil      = require('gulp-util');
var livereload = require('gulp-livereload');
var sass       = require('gulp-sass');

var nodemon = require('gulp-nodemon');
var path = require('path');

// TASK server
// Starts server and listens for changes
gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js handlebars',
    ignore: ['gulpfile.js', 'test/'],
    env: { 'NODE_ENV': 'development' }
  });
});

// TASK watchify
// uses watchify to update small parts of bundle if needed
gulp.task('watchify', function() {
  var browserifyOpts = {
    entries: './app/app.js',
    transform: ['reactify', 'browserify-shim'],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true // Watchify
  };
  var b = watchify(browserify(browserifyOpts));
  b.transform(reactify);
  function bundle() {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/js'));
  }
  bundle();
  b.on('update', bundle);
  b.on('log', gutil.log);
});

// TASK live
// uses livereload to reload the page upon css change
gulp.task('css:livereload', function() {
  gulp.watch('./public/css/*.css', function(file) {
    gulp.src(file.path)
      .pipe(livereload({start: true}));
  });
});

// TASK sass
// Converts compiles files into css
gulp.task('sass', function() {
  gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

// TASK sass:watch
// watches over my scss files and calls task sass on change
gulp.task('sass:watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
});

gulp.task('code', ['watchify', 'server']);
gulp.task('design', ['sass:watch', 'css:livereload']);

gulp.task('default', ['design', 'code']);
