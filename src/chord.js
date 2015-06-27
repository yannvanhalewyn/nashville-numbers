(function() {

  var ChordData = require('./chord-data');
  var ChordDataFactory = require('./chord-data-factory.js');

  var Chord = function(raw) {
    this.raw = raw || "";

    this.musicNotationString = function() {
      this.interpolate();
      var root = this.getRootAsMusicNotationString();
      var triad = this.data.triad.replace(/min|m/i, "-");
      var seventh = this.data.seventh.replace(/maj/, "y");
      return root + triad + seventh;
    };

    this.interpolate = function() {
      this.data = ChordDataFactory.fromRawString(this.raw);
    };

    this.getRootAsMusicNotationString = function() {
      var r = this.data.root;
      if (r.length < 2 || r.indexOf("#") !== -1) return r.toUpperCase();
      if (r == "bb") return "B@";
      return r.replace(/b/, "@").toUpperCase();
    }
  };

  module.exports = Chord;

}())
