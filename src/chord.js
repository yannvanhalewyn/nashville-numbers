(function() {

  var ChordData = require('./chord-data');
  var ChordDataFactory = require('./chord-data-factory.js');

  var Chord = function(raw) {
    this.raw = raw || "";

    this.musicNotationString = function() {
      this.interpolate();
      var root = this.data.root.toUpperCase();
      var triad = this.data.triad.replace(/min|m/i, "-");
      var seventh = this.data.seventh.replace(/maj/, "^");
      return root + triad + seventh;
    };

    this.interpolate = function() {
      this.data = ChordDataFactory.fromRawString(this.raw);
    };
  };

  module.exports = Chord;

}())
