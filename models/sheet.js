(function() {

  // var moment = require('moment');
  var include = require('include')
    , db      = require('../config/db')
    , _       = require('lodash')
    , Cypher  = include('/helpers/cypher')

  var DEFAULT = {
    title: "title",
    artist: "artist",
    visibility: "public"
  };

  var Sheet = function(params) {
    _.merge(this, params);
  }

/*
 * ========
 * INSTANCE
 * ========
 */
  Sheet.prototype.update = function(params) {
    var setTemplate = "s.{key} = '{val}'"
    var queries = [];
    _.forEach(params, function(val, key) {
      var tmp = setTemplate.replace("{key}", key);
      queries.push(tmp.replace("{val}", val));
    });
    var setString = "SET " + queries.join(',');
    return db.query(
      "MATCH (s:Sheet) WHERE id(s) = {sid} " + setString + " RETURN s", {sid: this._id}
    );
  }

  Sheet.prototype.destroy = function() {
    return db.query(
      "MATCH (s:Sheet) WHERE id(s) = {sid} " +
      "OPTIONAL MATCH s-[r]-() DELETE s,r", {sid: this._id}
    );
  }

  Sheet.prototype.author = function() {
    return db.query(
      "MATCH (s:Sheet)<-[:AUTHORED]-(p:Person) WHERE id(s) = {sid} RETURN p", {sid: this._id}
    ).then(function(result) {
      var User = include('/models/user')
      return new User(result[0].p);
    });
  }

/*
 * ======
 * STATIC
 * ======
 */
  // Should I check if the UID is an existing user?
  // ACTUALLY it doesn't go through with the query if MATCH finds nothing.
  // GOD I LOVE neo4j!! It does my error handling (missing uid), invalid uid,
  // Actually I think I don't even need this function, only users instantiate
  // sheets through createSheet
  Sheet.create = function(params) {
    params = _.assign({}, DEFAULT, params);
    params.data = JSON.stringify({main: {title: params.title, artist: params.artist}});
    var query = Cypher.match('p', 'Person');
    query += Cypher.whereIdIs('p', 'uid');
    query += Cypher.create('s', 'Sheet', _.omit(params, 'uid'));
    query += ",(p)-[:AUTHORED]->(s) RETURN s";
    return db.query(query, params).then(function(res) {
      return new Sheet(res[0].s);
    });
  }

  Sheet.findById = function(id) {
    var query = Cypher.match('s', 'Sheet');
    query += Cypher.whereIdIs('s', 'id');
    query += "RETURN s";
    return db.query(query, {id: parseInt(id)}).then(function(response) {
      if (_.isEmpty(response)) throw "Could not find sheet with id " + id;
      return new Sheet(response[0].s)
    });
  }

  module.exports = Sheet;

}())
