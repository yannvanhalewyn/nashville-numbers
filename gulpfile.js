'use strict';

var watchify   = require('watchify');
var browserify = require('browserify');
var reactify   = require('reactify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var gutil      = require('gulp-util');
var assign     = require('lodash.assign');

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
gulp.task('start', ['bundle', 'server']);

var browserifyOpts = {entries: './src/app.js', debug: true};

// TASK Bundle
// browserify's the javascript
gulp.task('bundle', function() {
  var b = browserify(browserifyOpts);
  b.transform(reactify);
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});

// TASK watch
// uses watchify to update small parts of bundle if needed
gulp.task('watch', function() {
  var opts = assign({}, watchify.args, browserifyOpts);
  var b = watchify(browserify(opts));
  b.transform(reactify);
  b.on('update', function() {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/js'));
  });
  b.on('log', gutil.log);
});
