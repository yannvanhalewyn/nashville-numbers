(function() {

  // Define and export constructor for circular dep with User.
  var _ = require('lodash');
  var Sheet = function(params) {
    _.merge(this, params);
  }
  module.exports = Sheet;


  // var moment = require('moment');
  var include = require('include')
    , db      = require('../config/db')
    , Cypher  = include('/helpers/cypher')
    , User    = include('/models/user')

/*
 * ========
 * INSTANCE
 * ========
 */

  /**
   * Updates the sheet in the database with the new params.
   *
   * @param {object} params The new params that want to be updated.
   * @return {object} An object representing the updated sheet.
   */
  Sheet.prototype.update = function(params) {
    var query = Cypher.match('sheet', 'Sheet');
    query += Cypher.whereIdIs('sheet', 'sid');
    query += Cypher.set('sheet', params);
    query += Cypher.return("sheet");
    return db.query(query, _.assign(params, {sid: this._id})).then(function(result) {
      return result[0].sheet;
    });
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

  var DEFAULT = {
    title: "title",
    artist: "artist",
    data: {}
  };

  /**
   * Creates a new sheet in the database.
   *
   * @param {object} params The params with which the new sheet will be created.
   * in the params object, an author_id property is required. This tells the
   * sheet to which user a AUTHERED relationship has to be created.
   * @return {Sheet} The newly create instance of Sheet.
   * @throws {error} when no author_id is provided.
   */
  Sheet.create = function(params, author_id) {
    if (!author_id) throw "Cannot create a sheet without a valid author ID.";
    params = _.defaults(params, DEFAULT);
    params.data = JSON.stringify(params.data);
    var query = Cypher.match('author', 'Person');
    query += Cypher.whereIdIs('author', 'author_id');
    query += Cypher.create('sheet', 'Sheet', params);
    query += ",(author)-[:AUTHORED]->(sheet) RETURN sheet";
    return db.query(query, _.merge(params, {author_id: parseInt(author_id)})).then(function(res) {
      return new Sheet(res[0].sheet);
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

}())
