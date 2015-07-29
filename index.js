(function() {

"use strict";

var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var session        = require('express-session');
var exphbs         = require('express-handlebars');

// Create the app
var app            = express();

// Setup port, view engine and body-parser
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/', express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
  resave: false,
  secret: 'a dirty little secret',
  saveUninitialized: false,
  httpOnly: true
}));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// Setup Routes and configurations
require('./config/passport')(app);
require('./config/helpers')(app);
require('./config/routes')(app);

module.exports = app;

}())
