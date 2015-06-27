(function() {

  var ChordData = require('./chord-data');

  var Factory = {
    // TODO: Recognize accidentals
    // TODO: Recognize extensions
    fromRawString: function(string) {
      var rootReg = "([a-g1-7])";
      var triadReg = "(min|m|-)?"
      var seventhReg = "(7|maj|\\^)?"
      var regex = rootReg + triadReg +  seventhReg;
      var match = string.match(new RegExp(regex, "i"));
      if (!match) return new ChordData();
      return new ChordData(match[1], match[2], match[3]);
    }
  };

  module.exports = Factory;

}())
