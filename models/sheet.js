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
      return sheet[0].s;
    });
  }

  module.exports = Sheet;

}())
