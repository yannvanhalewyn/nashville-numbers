(function() {

  var fs = require('fs');

  var Routes = {
    index: function(req, res) {
      fs.readFile('./app/dummyNormalizedSmall.json', function(err, data) {
        if (err) throw err;
        res.render('sheet', {
          active: {active_dashboard: true},
          state: JSON.stringify(JSON.parse(data))
        });
      });
    }
  };

  module.exports = Routes;

}())
