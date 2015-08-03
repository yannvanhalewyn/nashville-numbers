(function() {

  var keyMirror = require('keymirror');

  var SheetConstants = keyMirror({
    UPDATE_CHORD_TEXT: null,
    APPEND_NEW_CHORD: null,
    APPEND_NEW_BAR: null,
    APPEND_NEW_ROW: null,
    APPEND_NEW_SECTION: null,
    DELETE_SELECTED_CHORD: null,
    DELETE_SELECTED_BAR: null,
    DELETE_SELECTED_ROW: null,
    DELETE_SELECTED_SECTION: null,
    DELETE_CHORD: null,
    STORE_CHORD_REF_AS_SELECTED: null,

    //Symbols
    TOGGLE_SEGNO: null,
    TOGGLE_CODA: null,
    TOGGLE_REPEAT_LEFT: null,
    TOGGLE_REPEAT_RIGHT: null,

    // NETWORK
    SAVE_SHEET: null
  });

  module.exports = SheetConstants;

}())
