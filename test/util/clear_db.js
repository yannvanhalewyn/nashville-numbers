(function() {

  "use strict";

  var db = require('../../config/db');

  afterEach(function() {
    return db.query(
      "MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r",
      {title: "The title"}
    )
  });

}())
