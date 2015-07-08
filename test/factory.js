(function() {

  "use strict";

  var Factory = require('factory-lady');
  var Chance = require('chance');
  var User = require('../models/user');

  var chance = new Chance();

  Factory.define('user', User, {
    firstName: chance.first(),
    lastName: chance.last(),
    provider_id: chance.integer(),
    provider: 'facebook'
  });

  module.exports = Factory;

}())

