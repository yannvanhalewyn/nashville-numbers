var gulp = require('gulp')
  , browserify   = require('browserify')
  , watchify     = require('watchify')
  , reactify     = require('reactify')
  , gutil        = require('gulp-util')
  , source       = require('vinyl-source-stream')
  , path         = require('path')

var files = [
  './app/sheetEditor/editor.js',
  './app/friendslist/friendslist.js',
  './app/userpage/userpage.js',
  './app/hubs/hubs.js',
  './app/hubpage/hubpage.js'
];

function bundle(b, file) {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(path.basename(file, path.extname(file)) + '.bundle.js'))
    .pipe(gulp.dest('./public/js'));
}

// The bundle task -- runs once
module.exports = function() {
  return files.map(function(file) {
    var b = browserify({ entries: file, transform: ['reactify', 'browserify-shim'] });
    return bundle(b, file);
  });
}

// The watchify task
module.exports.watchify = function() {
  return files.map(function(file) {
    var browserifyOpts = {
      entries: file,
      transform: ['reactify', 'browserify-shim'],
      debug: true,
      cache: {}, packageCache: {}, fullPaths: true // Watchify
    };

    // Create the watchify task
    var b = watchify(browserify(browserifyOpts));
    b.on('log', gutil.log);
    b.on('update', bundle.bind(null, b, file));

    // Run bundle when task starts
    bundle(b, file);
  });
}
