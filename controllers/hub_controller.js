(function() {

  module.exports.controller = function(app) {
    app.get('/hubs', function(req, res) {
      res.render('layouts/main', {body: "Welcome to HUB"})
    })
  };

}())
