(function() {

  "use strict";

  var db = require('../../config/db');

  afterEach(function() {
    return db.query(
      "MATCH (s:Sheet {title: {title}}) OPTIONAL MATCH (s)-[r]-() DELETE s,r",
      {title: "The title"}
    )
  });

}())
