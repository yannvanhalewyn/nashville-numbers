(function() {

  var mongoose = require('mongoose');
  var moment = require('moment');
  var Schema = mongoose.Schema;
  var User = require('./user');

  var SheetSchema = new Schema({
    title: {type: String, required: true},
    artist: String,
    authorID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    visibility: {type: String, default: 'public'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date},
    data: String
  });

  SheetSchema.virtual('createdAtInWords').get(function() {
    return moment(this.created_at).fromNow();
  });

  SheetSchema.virtual('author').get(function() {
    return User.findById(this.authorID).exec();
  });

  SheetSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
  });

  module.exports = mongoose.model('Sheet', SheetSchema);

}())
