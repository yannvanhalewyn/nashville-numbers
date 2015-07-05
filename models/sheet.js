(function() {

  var Mongoose = require('mongoose');
  var moment = require('moment');
  var Schema = Mongoose.Schema;

  var SheetSchema = new Schema({
    title: {type: String, required: true},
    artist: String,
    public: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now},
    data: String
  });

  SheetSchema.virtual('createdAtInWords').get(function() {
    return moment(this.created_at).fromNow();
  });

  module.exports = Mongoose.model('Sheet', SheetSchema);

}())
