(function() {

  "use strict";

  var Factory = require('factory-lady');
  var Chance  = require('chance');
  var User    = require('../models/user');
  var Sheet   = require('../models/sheet');
  var Q       = require('q');
  var chance  = new Chance();

  Factory.define('user', User, {
    firstName: chance.first(),
    lastName: chance.last(),
    provider_id: chance.integer(),
    provider: 'facebook'
  });

  Factory.define('sheet', Sheet, {
    title: chance.word(),
    artist: chance.name(),
    authorID: chance.string({pool: '123456789abcdef', length: 24}),
  });

  var build = function(model, params) {
    var defered = Q.defer();
    Factory.build(model, params, function(data) {
      defered.resolve(data);
    })
    return defered.promise;
  }

  module.exports = build;

}())

