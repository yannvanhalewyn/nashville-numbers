(function() {

  var ChordData = require('./chord-data');

  var Factory = {
    // TODO: Recognize extensions
    fromRawString: function(string) {
      var rootReg = "([#b]?[a-g1-7](?!ug)[#b]?)"; // A negative lookahead for excluding a if part of aug
      var triadReg = "(min|m(?!aj)|-|\\+|aug)?";  // A negative lookahead for finding 'm' that is not part of 'maj'
      var seventhReg = "(7|maj|\\^)?"
      var regex = rootReg + triadReg +  seventhReg;
      var match = string.match(new RegExp(regex, "i"));
      if (!match) return new ChordData();
      return new ChordData(match[1], match[2], match[3]);
    }
  };

  module.exports = Factory;

}())
