(function() {

  "use strict";

  var FuzzyMatch = function(string, pattern) {
    var regex  = pattern.replace(/ /g, "").split("").join(".*?");
    return string.match(new RegExp(regex, "i"));
  }

  module.exports = FuzzyMatch;

}())
