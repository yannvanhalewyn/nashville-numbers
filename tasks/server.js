var nodemon = require('gulp-nodemon')

module.exports = function() {
  return nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['gulpfile.js', 'test/', 'app/', 'public/'],
    env: { 'NODE_ENV': 'development' }
  });
};
