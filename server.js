"use strict";

var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var session        = require('express-session');
var exphbs         = require('express-handlebars');
var mongoose       = require('mongoose');
var config         = require('./config');

// Create the app
var app          = express();

// Setup port, view engine and body-parser
app.set('port', process.env.PORT || config.PORT);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/', express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
  resave: false,
  secret: 'a dirty little secret',
  saveUninitialized: false
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
require('./config/routes')(app);

// Connect to DB
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
  // Start server
  app.listen(app.get('port'), function() {
    console.log("Server listening on port " + app.get('port'));
  });
});
mongoose.connection.on('error', function (err) {
  console.error('Could not connect to mongo server!');
  console.log(err);
  process.exit(1);
});
mongoose.connect(config.db_url);
