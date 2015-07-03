(function() {

  module.exports.controller = function(app) {

    app.get('/explore', function(req, res) {
      res.render('explore', {active: {active_explore: true}})
    })
  };

}())
