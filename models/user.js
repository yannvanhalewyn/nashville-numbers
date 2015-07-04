(function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    displayName: String,
    userName: String,
    provider: { type: String, require: true },
    provider_id: { type: String, required: true },
    providerData: Object
  });


  UserSchema.statics.findOrCreate = function(authData, cb) {
    this.findOne({provider_id: authData.provider_id}, function(err, result) {
      if(err) cb(err, null);
      else {
        if (result) {
          cb(null, result)
        } else {
          var newUser = new this(authData);
          newUser.save(function(err) {
            if(err) cb(err, null);
            else cb(null, newUser);
          });
        }
      }
    }.bind(this));
  };

  module.exports = mongoose.model('User', UserSchema);

}())
