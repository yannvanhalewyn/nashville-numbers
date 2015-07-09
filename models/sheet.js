(function() {

  // var moment = require('moment');
  var db = require('../config/db')
    , _ = require('lodash')

  var DEFAULT = {
    title: "title",
    artist: "artist",
    visibility: "public"
  };

  var Sheet = function(params) {
    params = _.assign({}, DEFAULT, params);
    return db.query("CREATE (s:Sheet {" +
      "title: {title}," +
      "artist: {artist}," +
      "visibility: {visibility}" +
    "}) RETURN s", params)
    .then(function(sheet) {
      var obj = sheet[0].s;
      this.id = obj._id;
      this.title = obj.properties.title;
      this.artist = obj.properties.artist;
      this.visibility = obj.properties.visibility;
      return this;
    }.bind(this));
  }

  module.exports = Sheet;

}())


// // TODO give default artist, like undefined or some musician
// var SheetSchema = new Schema({
//   title: {type: String, required: true},
//   artist: String,
//   authorID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//   visibility: {type: String, default: 'public'},
//   created_at: {type: Date, default: Date.now},
//   updated_at: {type: Date, default: Date.now},
//   data: String
// });
//
// // TODO create method .public() that returns if visibility == 'public'
// SheetSchema.virtual('createdAtInWords').get(function() {
//   return moment(this.created_at).fromNow();
// });
//
// SheetSchema.virtual('author').get(function() {
//   return User.findById(this.authorID).exec();
// });
//
// SheetSchema.pre('update', function(next) {
//   this.updated_at = Date.now();
//   next();
// });
//
// SheetSchema.pre('save', function(next) {
//   this.data = JSON.stringify({
//     main: { title: this.title, artist: this.artist, dbid: this._id }
//   });
//   next();
// });
//
// module.exports = mongoose.model('Sheet', SheetSchema);
