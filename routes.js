(function() {

  var fs = require('fs');

  var Routes = {
    index: function(req, res) {
      res.render('signin', {layout: null});
    }
  };

  module.exports = Routes;

}())
