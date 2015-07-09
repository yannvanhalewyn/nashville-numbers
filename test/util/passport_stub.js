(function() {

  "use strict";

  var done = function(user, req, next) {
    return next(null, user);
  }

  var PassportStub = {
    _handle: function(req, res, next) {
      if (!this.active) {
        return next();
      }

      var passport = {
        deserializeUser: done,
        serializeUser: done,
        _userProperty: 'user',
        _key: 'passport'
      };

      req.__defineGetter__('_passport', function() {
        return {
          instance: passport,
          session: {
            user: this.user
          }
        };
      }.bind(this));

      req.__defineGetter__('user', function() {
        return this.user;
      }.bind(this));
      return next();
    },

    install: function(app) {
      this.app = app;
      return this.app._router.stack.unshift({
        match: function() {
          return true;
        },
        path: '',
        // handle: this._handle.bind(this),
        handle_request: this._handle.bind(this),
        _id: 'passport.stub'
      });
    },

    uninstall: function() {
      if (this.app == null) {
        return;
      }
      return this.app._router.stack.forEach(function(middleware, index, stack) {
        if (middleware._id === 'passport.stub') {
          return stack.splice(index, 1);
        }
      })
    },

    login: function(user) {
      if (this.app == null) {
        throw new Error('Passport Stub not installed. Please run "passportStub.install(app)" first.');
      }
      this.active = true;
      return this.user = user;
    },

    logout: function() {
      return this.active = false;
    }
  }

  module.exports = PassportStub;
}())
