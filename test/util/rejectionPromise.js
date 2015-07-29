(function() {

  "use strict";

  var Q = require('q');

  var RejectionPromise = function(theError) {
    var defered = Q.defer();
    defered.reject(theError);
    return defered.promise;
  }

  module.exports = RejectionPromise;

}())
