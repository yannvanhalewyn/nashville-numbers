(function() {

  var keyMirror = require('keymirror');

  var SheetConstants = keyMirror({
    UPDATE_CHORD_TEXT: null,
    APPEND_NEW_CHORD: null,
    APPEND_NEW_BAR: null,
    APPEND_NEW_ROW: null,
    APPEND_NEW_SECTION: null,
    DELETE_SELECTED_BAR: null,
    DELETE_CHORD: null,
    STORE_CHORD_REF_AS_SELECTED: null
  });

  module.exports = SheetConstants;

}())
