(function() {

  var DashboardController = {
    index: function(req, res) {
      res.render("dashboard", {
        active: {active_dashboard: true},
        user: req.user
      });
    }
  }
  module.exports = DashboardController;

}())
