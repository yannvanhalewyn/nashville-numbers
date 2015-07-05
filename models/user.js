(function() {

  var mongoose = require('mongoose');
  var Schema   = mongoose.Schema;
  var Q        = require('q');

  var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    displayName: String,
    userName: String,
    picture: String,
    provider: { type: String, required: true },
    provider_id: { type: String, required: true },
    providerData: Object
  });

  // TODO putting this in header just didn't work
  // Find out what's up, but this makes my tests pass.
  UserSchema.virtual('sheets').get(function() {
    var Sheet = require('./sheet')
    return Sheet.find({authorID: this._id});
  });

  var User = mongoose.model('User', UserSchema);

  module.exports = User;

  module.exports.registerFacebookUser = function(authData) {
    return User.findOne({provider_id: authData.provider_id})
    .then(function(result) {
      if (result) {
        return result;
      }
      return User.create(authData)
    })
  }

}());

