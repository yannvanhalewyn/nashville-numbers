(function() {

  "use strict";

  var db = require('../config/db');

  var User = function(params) {
    return db.query("CREATE (p:Person {firstName: {firstName}," +
                    "lastName: {lastName}, provider_id: {provider_id}," +
                    "provider: {provider}}) RETURN p", params)
    .then(function(res) {
      return res[0].p;
    });
  }

  User.findById = function(id) {
    return db.query("MATCH (p:Person) WHERE id(p) = {id} RETURN p", {id: id})
    .then(function(result) {
      return result[0].p;
    });
  }

  module.exports = User;

}())
