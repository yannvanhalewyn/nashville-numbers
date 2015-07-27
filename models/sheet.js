(function() {

  // var moment = require('moment');
  var include = require('include')
    , db      = require('../config/db')
    , _       = require('lodash')
    , Cypher  = include('/helpers/cypher')
    , User    = include('/models/user') // This is a circular dep. There seems to be no issues .. ?

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

  /**
   * Updates the sheet in the database with the new params.
   *
   * @param {object} params The new params that want to be updated.
   * @return {Sheet} An updated instance of the Sheet
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

  /**
   * Destroys the sheet in the database that matches the instance's ID.
   *
   */
  Sheet.prototype.destroy = function() {
    return db.query(
      "MATCH (s:Sheet) WHERE id(s) = {sid} " +
      "OPTIONAL MATCH s-[r]-() DELETE s,r", {sid: this._id}
    );
  }

  /**
   * Finds the author of the Sheet
   *
   * @return {User} An instance of User containing the properties of the sheet's author.
   */
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

  /**
   * Creates a new sheet in the database.
   *
   * @param {object} params The params with which the new sheet will be created.
   * @return {Sheet} The newly create instance of Sheet.
   */
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

  /**
   * Finds a sheet in the database based on the given ID.
   *
   * @param {number/string} id The ID of the sheet we're trying to find in the database.
   * @return {Sheet} An instance of Sheet containing the properties of the found object.
   * @throws {Error} When no sheet has been found by that ID.
   */
  Sheet.findById = function(id) {
    var query = Cypher.match('s', 'Sheet');
    query += Cypher.whereIdIs('s', 'id');
    query += "RETURN s";
    return db.query(query, {id: parseInt(id)}).then(function(response) {
      if (_.isEmpty(response)) throw "Could not find sheet with id " + id;
      return new Sheet(response[0].s)
    });
  }

  /**
   * Finds a sheet in the databased based on the given ID and returns the user
   * that AUTHORED the sheet.
   *
   * @param {string/number} sheetID the ID of the sheet.
   * @return {object} An object containing a Sheet instance as sheet and a User
   * instance as author.
   * @throws {Error} When no sheet has been found by that ID.
   */
  Sheet.findByIdWithAuthor = function(sheetID) {
    return db.query(
      "MATCH (sheet:Sheet)<-[:AUTHORED]-(author:Person) " +
      "WHERE id(sheet) = {sid} RETURN sheet, author",
      {sid: parseInt(sheetID)}
    ).then(function(result) {
      if (_.isEmpty(result)) throw "Could not find sheet with id " + sheetID;
      return {
        sheet: new Sheet(result[0].sheet),
        author: new User(result[0].author)
      };
    })
  }

  module.exports = Sheet;

}())
