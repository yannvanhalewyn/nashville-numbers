(function() {

  var mongoose = require('mongoose');
  var Schema   = mongoose.Schema;
  var _        = require('lodash');

  var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    displayName: String,
    userName: String,
    picture: String,
    friend_ids: Array,
    provider: { type: String, required: true },
    provider_id: { type: String, required: true },
    providerData: Object
  });

  // TODO putting require('sheet') in header just didn't work
  // Find out what's up, but this makes my tests pass for now
  UserSchema.virtual('sheets').get(function() {
    var Sheet = require('./sheet')
    return Sheet.find({authorID: this._id});
  });

  UserSchema.methods.createSheet = function(params) {
    var Sheet = require('./sheet')
    params.authorID = this._id;
    return Sheet.create(params);
  };

  UserSchema.methods.addFriend = function(otherUID) {
    if (!mongoose.Types.ObjectId.isValid(otherUID.toString())) return;
    var alreadyAdded = this.friend_ids.some(function(friendID) {
      return friendID.equals(otherUID);
    });
    if (alreadyAdded) return;
    this.friend_ids.push(otherUID);
  };

  UserSchema.methods.removeFriend = function(otherUID) {
    _.remove(this.friend_ids, function(id) {
      return id.equals(otherUID);
    });
  };

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
