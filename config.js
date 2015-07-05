(function() {

  var config;
  if (process.env.NODE_ENV === 'test') {
    config = require('./config/test');
  } else {
    config = require('./config/development');
  }

  module.exports = config;

}())
