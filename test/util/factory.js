(function() {

  "use strict";

  var Monky    = require('monky')
    , mongoose = require('mongoose')
    , monky    = new Monky(mongoose)

  monky.factory('User', {
    firstName: 'firstName-#n',
    lastName: 'lastName-#n',
    provider_id: '#n',
    provider: 'facebook'
  });

  monky.factory('Sheet', {
    title: 'title-#n',
    artist: 'artist-#n',
    authorID: monky.ref('User', 'id')
  });

  module.exports = monky;

}())

