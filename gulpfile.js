var gulp = require('gulp');

function getTask(taskName) {
  return require('./tasks/' + taskName);
}

gulp.task('server', getTask('server'));
gulp.task('bundle', getTask('bundle'));
gulp.task('watchify', getTask('bundle').watchify);
gulp.task('livereload', getTask('livereload'));
gulp.task('sass', getTask('sass'));
gulp.task('sass:watch', getTask('sass').watch);

// Util
gulp.task('seed', getTask('util').seed);
gulp.task('routes', getTask('util').routes);

// Task groups
gulp.task('code', ['watchify', 'server']);
gulp.task('design', ['sass:watch', 'livereload']);
gulp.task('heroku:production', ['sass', 'bundle'])
gulp.task('default', ['design', 'code']);
