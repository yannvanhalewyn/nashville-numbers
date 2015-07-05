(function() {

  var Sheet = require('./sheet');
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

  UserSchema.virtual('sheets').get(function() {
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

