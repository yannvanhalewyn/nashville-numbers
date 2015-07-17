(function() {

  "use strict";

  var include = require('include')
    , _       = require('lodash')
    , Chance  = require('chance')
    , User    = include('/models/user')
    , Sheet   = include('/models/sheet')
    , Hub     = include('/models/hub')

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
    },

    'hub': function() {
      return {
        name: chance.word()
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
          return Factory('user').then(function(params, user) {
            var params = _.assign(chance.sheet(), {uid: user._id}, params)
            return Sheet.create(params)
            .then(function(sheet) {
              return {user: user, sheet: sheet}; // The awesome final touch!!
            });
          }.bind(this, params)).catch(console.error); // Bind is the hack needed to pass the params on
        }
        break;

      case 'hub':
        if (params && params.creator_id) {
          return Hub.create(_.assign(chance.hub(), params));
        } else {
          return Factory('user').then(function(params, user) {
            var params = _.assign(chance.hub(), {creator_id: user._id}, params);
            return Hub.create(params)
            .then(function(hub) {
              return {user: user, hub: hub};
            });
          }.bind(this, params)).catch(console.error);
        }
        break;

      default:
        throw "Model " + model + " is not recognised!";
        break;
    }
  }

  module.exports = Factory;

}())

