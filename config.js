(function() {

  var config;
  if (process.env.NODE_ENV === 'test') {
    config = require('./config/test');
  } else if (process.env.NODE_ENV === 'development'){
    config = require('./config/development');
  } else {
    config = require('./config/production')
  }

  module.exports = config;

}())
