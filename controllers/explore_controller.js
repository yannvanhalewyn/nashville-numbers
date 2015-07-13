(function() {

  ExploreController = {

    index: function(req, res) {
      res.render('explore', {active_explore: true});
    }

  };

  module.exports = ExploreController;

}())
