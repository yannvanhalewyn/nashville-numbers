#!/usr/bin/env node
var app      = require('./index')
var config   = require('./config');

app.set('port', process.env.PORT || config.PORT);

app.listen(app.get('port'), function() {
  console.log("Server listening on port " + app.get('port'));
})
