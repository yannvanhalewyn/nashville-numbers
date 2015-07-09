(function() {

  "use strict";

  var db = require('../config/db');

  var User = function(params) {
    return db.query("CREATE (p:Person {firstName: {firstName}," +
                    "lastName: {lastName}, provider_id: {provider_id}," +
                    "provider: {provider}}) RETURN p", params)
    .then(function(res) {
      var obj = res[0].p;
      this.id = obj._id;
      this.firstName   = obj.properties.firstName;
      this.lastName    = obj.properties.lastName;
      this.provider_id = obj.properties.provider_id;
      this.provider    = obj.properties.provider;
      return this;
    }.bind(this))
  }

  module.exports = User;

}())
