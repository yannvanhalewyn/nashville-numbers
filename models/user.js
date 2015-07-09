(function() {

  var mongoose = require('mongoose');
  var Schema   = mongoose.Schema;
  var _        = require('lodash');

/*
 * ========
 *   SCHEMA
 * ========
 */
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

/*
 * =================
 *   VIRTUAL .sheets
 * =================
 */
  // TODO putting require('sheet') in header just didn't work
  // Find out what's up, but this makes my tests pass for now
  // Actually I just read virtuals are not suitable for querying documents
  // Should make it into sheet() method later
  UserSchema.virtual('sheets').get(function() {
    var Sheet = require('./sheet')
    return Sheet.find({authorID: this._id});
  });

/*
 * ==================
 *   METHOD .friends
 * ==================
 */
  UserSchema.methods.getFriends = function() {
    return this.model('User').find({_id: {$in: this.friend_ids}});
  };

/*
 * =======================
 *   METHOD #createSheet()
 * =======================
 */
  UserSchema.methods.createSheet = function(params) {
    var Sheet = require('./sheet')
    params.authorID = this._id;
    return Sheet.create(params);
  };

/*
 * =====================
 *   METHOD #addFriend()
 * =====================
 */
  UserSchema.methods.addFriend = function(otherUID) {
    if (!mongoose.Types.ObjectId.isValid(otherUID.toString())) return;
    var alreadyAdded = this.friend_ids.some(function(friendID) {
      return friendID.equals(otherUID);
    });
    if (alreadyAdded) return;
    this.friend_ids.push(otherUID);
    return this.save();
  };

/*
 * ========================
 *   METHOD #removeFriend()
 * ========================
 */
  UserSchema.methods.removeFriend = function(otherUID) {
    _.remove(this.friend_ids, function(id) {
      return id.equals(otherUID);
    });
    return this.update({$set: {friend_ids: this.friend_ids}});
  };

/*
 * =========
 *   EXPORTS
 * =========
 */
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
