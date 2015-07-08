(function() {

  module.exports = {
    index: function(req, res) {
      res.render('hubs', {active_hubs: true})
    }
  };

}())
