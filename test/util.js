'use strict';

process.env.NODE_ENV = 'test';

var config = require('../config');
var mongoose = require('mongoose');

function _clearDB() {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove()
  }
}

// Use mock DB, or clear db afterEach
if (config.use_mock_db) {
  var clearDB = require('mocha-mongoose')(config.db_url);
} else {
  afterEach(function() {
    _clearDB();
  });
}

beforeEach(function(done) {
  // Clear DB
  if (mongoose.connection.db) return done();
  mongoose.connect(config.db_url, done);
});
