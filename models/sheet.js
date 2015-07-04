(function() {

  var Mongoose = require('mongoose');
  var Schema = Mongoose.Schema;

  var SheetSchema = new Schema({
    title: String,
    artist: String,
    data: String
  });

  module.exports = Mongoose.model('Sheet', SheetSchema);

}())
