(function() {

  "use strict";

  var include = require('include')
    , _       = require('lodash')
    , Chance = require('chance')
    , User    = include('/models/user')
    // , Sheet = include('/models/sheet')

  var chance = new Chance();
  chance.mixin({
    'user': function() {
      return {
        firstName: chance.first(),
        lastName: chance.last(),
        provider_id: chance.string(),
        provider: 'facebook'
      }
    },
  });

  var Factory = function(model, params) {
    switch (model.toLowerCase()) {
      case 'user':
        return new User(_.assign(chance.user(), params));

      case 'sheet':
        break;

      default:
        throw "Model " + model + " is not recognised!";
        break;
    }
  }

  module.exports = Factory;

}())

