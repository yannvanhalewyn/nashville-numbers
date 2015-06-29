(function() {

  var keyMirror = require('keymirror');

  var SheetConstants = keyMirror({
    UPDATE_CHORD_TEXT: null,
    APPEND_NEW_CHORD: null,
    DELETE_CHORD: null
  });

  module.exports = SheetConstants;

}())
