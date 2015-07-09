(function() {

  "use strict";

  var include = require('include')
    , _       = require('lodash')
    , Chance = require('chance')
    , User    = include('/models/user')
    , Sheet = include('/models/sheet')

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

    'sheet': function() {
      return {
        title: chance.word(),
        artist: chance.first(),
        visibility: 'public'
      }
    }
  });

  var Factory = function(model, params) {
    switch (model.toLowerCase()) {
      case 'user':
        return User.create(_.assign(chance.user(), params));

      case 'sheet':
        if (params && params.uid) {
          return Sheet.create(_.assign(chance.sheet(), params));
        } else {
          return Factory('user').then(function(user) {
            return Sheet.create(_.assign(chance.sheet(), {uid: user._id}, params))
            .then(function(sheet) {
              return {user: user, sheet: sheet}; // The awesome final touch!!
            });
          }).catch(console.error);
        }
        break;

      default:
        throw "Model " + model + " is not recognised!";
        break;
    }
  }

  module.exports = Factory;

}())

