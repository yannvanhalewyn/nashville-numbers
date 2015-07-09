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
    _.merge(this, params);
  }

  Sheet.create = function(params) {
    params = _.assign({}, DEFAULT, params);
    return db.query(
      "MATCH (p:Person) WHERE id(p) = {uid}" +
      "CREATE (s:Sheet {" +
        "title: {title}," +
        "artist: {artist}," +
        "visibility: {visibility}" +
      "})," +
      "(p)-[:AUTHORED]->(s)" +
      "RETURN s", params)
    .then(function(res) {
      return new Sheet(res[0].s);
    });
  }

  module.exports = Sheet;

}())
