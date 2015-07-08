#!/usr/bin/env node
var app      = require('./index')
var mongoose = require('mongoose');
var config   = require('./config');

app.set('port', process.env.PORT || config.PORT);

// Connect to DB
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
  // Start server
  app.listen(app.get('port'), function() {
    console.log("Server listening on port " + app.get('port'));
  })
});

// Log errors
mongoose.connection.on('error', function (err) {
  console.error('MONGO ERROR:');
  console.log(err);
});

mongoose.connect(config.db_url);
