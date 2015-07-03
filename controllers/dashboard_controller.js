(function() {

  module.exports.controller = function(app) {

    app.get('/dashboard', function(req, res) {
      res.render("dashboard", {active: {active_dashboard: true}});
    });

  };

}())
