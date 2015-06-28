'use strict';

var watchify   = require('watchify');
var browserify = require('browserify');
var reactify   = require('reactify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var gutil      = require('gulp-util');

var nodemon = require('gulp-nodemon');
var path = require('path');

// TASK server
// Starts server and listens for changes
gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js handlebars',
    ignore: 'gulpfile.js',
    env: { 'NODE_ENV': 'development' }
  });
});

/*
 * ========
 * BUNDLING
 * ========
 */
var browserifyOpts = {
  entries: './app/app.js',
  transform: ['reactify'],
  debug: true,
  cache: {}, packageCache: {}, fullPaths: true // Watchify
};

// TASK Bundle
// browserify's the javascript
gulp.task('bundle', function() {
  var b = browserify(browserifyOpts);
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});

// TASK watchify
// uses watchify to update small parts of bundle if needed
gulp.task('watchify', function() {
  var b = watchify(browserify(browserifyOpts));
  b.transform(reactify);
  function bundle() {
    console.log("Bundling");
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/js'));
  }
  bundle();
  b.on('update', bundle);
  b.on('log', gutil.log);
});

gulp.task('default', ['watchify', 'server']);
