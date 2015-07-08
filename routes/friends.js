(function() {

  "use strict";

  var FriendsRouter = require('express').Router();

  FriendsRouter.get('/friends', function(req, res) {
    res.render('friends');
  });

  module.exports = FriendsRouter;

}())
