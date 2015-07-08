(function() {

  var mongoose = require('mongoose');
  var moment = require('moment');
  var Schema = mongoose.Schema;
  var User = require('./user');

  // TODO give default artist, like undefined or some musician
  var SheetSchema = new Schema({
    title: {type: String, required: true},
    artist: String,
    authorID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    visibility: {type: String, default: 'public'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    data: String
  });

  // TODO create method .public() that returns if visibility == 'public'
  SheetSchema.virtual('createdAtInWords').get(function() {
    return moment(this.created_at).fromNow();
  });

  SheetSchema.virtual('author').get(function() {
    return User.findById(this.authorID).exec();
  });

  SheetSchema.pre('update', function(next) {
    this.updated_at = Date.now();
    next();
  });

  SheetSchema.pre('save', function(next) {
    this.data = JSON.stringify({
      main: { title: this.title, artist: this.artist, dbid: this._id }
    });
    next();
  });

  module.exports = mongoose.model('Sheet', SheetSchema);

}())
