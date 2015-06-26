var express = require('express');
var app = express();
var routes = require('./routes');
var exphbs = require('express-handlebars');

app.set('port', process.env.PORT || 3000);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', express.static(__dirname + '/public/'));

app.get('/', routes.index);

app.listen(app.get('port'), function() {
  console.log("Server listening on port " + app.get('port'));
});
