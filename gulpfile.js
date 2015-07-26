'use strict';

var watchify     = require('watchify')
  , browserify   = require('browserify')
  , reactify     = require('reactify')
  , gulp         = require('gulp')
  , source       = require('vinyl-source-stream')
  , gutil        = require('gulp-util')
  , livereload   = require('gulp-livereload')
  , sass         = require('gulp-sass')
  , postcss      = require('gulp-postcss')
  , autoprefixer = require('autoprefixer-core')
  , path         = require('path')
  , nodemon      = require('gulp-nodemon')

/**
 * ===========
 * TASK SERVER
 * ===========
 *
 * Starts server and listens for changes
 */
gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js handlebars',
    ignore: ['gulpfile.js', 'test/', 'app/', 'public/'],
    env: { 'NODE_ENV': 'development' }
  });
});

/**
 * =============
 * TASK WATCHIFY
 * =============
 *
 * Creates a task to bundle and watch every main app feature
 */
gulp.task('watchify', function() {

  // The starting files = feature in-points
  var files = [
    './app/sheet/editor.js',
    './app/friendslist/friendslist.js',
    './app/userpage/userpage.js',
    './app/hubs/hubs.js',
    './app/hubpage/hubpage.js'
  ];

  // Map a task for each file
  var tasks = files.map(function(file) {
    // Setup browsowatchify options
    var browserifyOpts = {
      entries: file,
      transform: ['reactify', 'browserify-shim'],
      debug: true,
      cache: {}, packageCache: {}, fullPaths: true // Watchify
    };

    // The bundle function
    function bundle() {
      b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(path.basename(file, path.extname(file)) + '.bundle.js'))
        .pipe(gulp.dest('./public/js'));
    }

    // Create the watchify task
    var b = watchify(browserify(browserifyOpts))
      .on('log', gutil.log)
      .on('update', bundle);

    // Run bundle when task starts
    bundle();
  });
});


/*
 * =========
 * TASK LIVE
 * =========
 *
 * uses livereload to reload the page upon css change
 */
gulp.task('css:livereload', function() {
  gulp.watch('./public/css/*.css', function(file) {
    gulp.src(file.path)
      .pipe(livereload({start: true}));
  });
});

/*
 * =========
 * TASK SASS
 * =========
 *
 * Converts compiles files into css
 */
gulp.task('sass', function() {
  gulp.src('app/scss/index.scss')
    .pipe(sass())
    .on('error', console.error)
    .pipe(postcss([ autoprefixer({ browsers: ['last 4 version'] }) ]))
    .pipe(gulp.dest('public/css/'));
});

/*
 * ===============
 * TASK sass:watch
 * ===============
 *
 * watches over my scss files and calls task sass on change
 */
gulp.task('sass:watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
});


/*
 * =========
 * TASK seed
 * =========
 *
 * Seeds the databse with some new users
 */
gulp.task('seed', function() {
  require('./test/util/seed_db').bind(this)();
});

/*
 * ===========
 * TASK routes
 * ===========
 *
 * Prints out beautiful tables of all the routes :)
 */
gulp.task('routes', function() {
  var printRoutes = require('./bin/printRoutes');
  printRoutes('/config/routes');
});


/*
 * ======
 * GROUPS
 * ======
 */
gulp.task('code', ['watchify', 'server']);
gulp.task('design', ['sass:watch', 'css:livereload']);
gulp.task('default', ['design', 'code']);
