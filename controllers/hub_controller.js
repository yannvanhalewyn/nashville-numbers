(function() {

  module.exports.controller = function(app) {
    app.get('/hubs', function(req, res) {
      res.render('hubs', {active: {active_hubs: true}})
    })
  };

}())
