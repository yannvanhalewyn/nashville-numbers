var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var routes     = require('./routes');
var exphbs     = require('express-handlebars');
var fs         = require('fs');

// Setup port, view engine and body-parser
app.set('port', process.env.PORT || 3000);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/', express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: false}));

// Home route
app.get('/', routes.index);

// Read in controllers
fs.readdirSync('./controllers').forEach(function(file) {
  if (file.match(/.+\.js$/)) {
    var route = require('./controllers/' + file);
    route.controller(app);
  }
});

// Start server
app.listen(app.get('port'), function() {
  console.log("Server listening on port " + app.get('port'));
});
