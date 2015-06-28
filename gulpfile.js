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
    tasks: function(changedFiles) {
      var tasks = [];
      changedFiles.forEach(function(file) {
        if (path.extname(file) === ".js" && !~tasks.indexOf('bundle')) tasks.push('bundle');
      });
      return tasks;
    },
    env: { 'NODE_ENV': 'development' }
  });
});

// TASK start
// Runs bundle and server
gulp.task('start', ['watch', 'server']);

var browserifyOpts = {
  entries: './src/app.js',
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

// TASK watch
// uses gulp.watch to hard reset bundle.js
gulp.task('watch', function() {
  gulp.watch(['src/**/*.js', 'components/**/*.js'], ['bundle']);
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
  gulp.watch(['./components/**/*.js', './src/**/*.js'], bundle);
  b.on('log', gutil.log);
});
