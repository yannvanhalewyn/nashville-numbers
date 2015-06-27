(function() {

  var ChordData = function(root, triad, seventh, extension){
    this.root = root || "";
    this.triad = triad || "";
    this.seventh = seventh || "";
    this.extension = extension || "";
  };

  module.exports = ChordData;

}())

