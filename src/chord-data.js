(function() {

  var ChordData = function(root, triad, seventh, extension){
    this.root = root || "";
    this.triad = triad || "";
    this.seventh = seventh || "";
    this.extension = extension || "";
    this.root = this.root.toUpperCase();
  };

  module.exports = ChordData;

}())

