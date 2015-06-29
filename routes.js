(function() {

  var fs = require('fs');

  var Routes = {
    index: function(req, res) {
      fs.readFile('./app/dummyNormalisedPretty.json', function(err, data) {
        if (err) throw err;
        res.render('sheet', {state: JSON.stringify(JSON.parse(data))});
      });
    }
  };

  module.exports = Routes;

}())
