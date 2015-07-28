(function() {

  "use strict";

  var errorStatus = function(status) {
    return function(err, req, res, next) {
      res.status(status).send(err);
    }
  }

  module.exports = errorStatus;

}())
