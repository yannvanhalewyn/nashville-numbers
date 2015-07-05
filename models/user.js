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
    provider: { type: String, require: true },
    provider_id: { type: String, required: true },
    providerData: Object
  });

  var findOne = Q.denodeify(UserSchema.findOne);

  var User = mongoose.model('User', UserSchema);

    // this.findOne({provider_id: authData.provider_id}, function(err, result) {
    //   if(err) cb(err, null);
    //   else {
    //     if (result) {
    //       cb(null, result);
    //     } else {
    //       var newUser = new this(authData);
    //       newUser.save(function(err) {
    //         if(err) cb(err, null);
    //         else cb(null, newUser); // Here you can add a 3rd param - redirectURL
    //       });
    //     }
    //   }
    // }.bind(this));


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

