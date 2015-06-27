'use strict';

var watchify   = require('watchify');
var browserify = require('browserify');
var reactify   = require('reactify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var gutil      = require('gulp-util');
var assign     = require('lodash.assign');

// add custom browserify options here
var customOpts = {
  entries: ['./src/app.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
b.transform(reactify);

gulp.task('js', bundle);
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js'));
}
