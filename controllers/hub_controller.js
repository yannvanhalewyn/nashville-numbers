(function() {

  module.exports = {
    index: function(req, res) {
      res.render('hubs', {active: {active_hubs: true}})
    }
  };

}())
