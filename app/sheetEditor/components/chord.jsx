(function() {

  /** @jsx React.DOM */
  "use strict";

  var React = require('react');
  var Chord = require('../chord');
  var SheetActions = require('../actions/sheetActions');
  var classNames = require('classnames');

  var KEYCODES = {
    SPACE: 32,
    RETURN: 13,
    ALT: 18
  }

  var ChordComponent = React.createClass({

    propTypes: {
      rawString: React.PropTypes.string,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        value: this.props.rawString,
        editing: false
      }
    },

    render: function() {
      var classes = {
        'chord': true,
        'chord-editing': this.state.editing,
        'chord-empty': !this.state.value
      };
      // TODO before production: check security of innerHTML. Maybe I don't need
      // any superscript, I could just have the font do the work and go back to
      // simple input boxes.
      return (
        <div
          contentEditable="true"
          className={classNames(classes)}
          onFocus={this._gainedFocus}
          onBlur={this._lostFocus}
          onKeyDown={this._onKeyDown}
          dangerouslySetInnerHTML={{__html: this.state.editing ? this.state.value :
            this._musicNotationString()}}
        />
      )
    },

    _musicNotationString: function() {
      return new Chord(this.state.value).musicNotationString();
    },

    _onKeyDown: function(e) {
      var shift = e.shiftKey;
      var meta = e.metaKey;
      var alt = e.altKey;

      switch(e.keyCode) {
        case KEYCODES.SPACE:
          if(shift) {
            SheetActions.removeChord();
          } else {
            SheetActions.addChord();
          }
          e.preventDefault();
          break;

        case KEYCODES.RETURN:
          if (shift) {
            if(meta) {
              SheetActions.removeSection();
            } else if(alt) {
              SheetActions.removeRow();
            } else {
              SheetActions.removeBar();
            }
          } else {
            if(meta) {
              SheetActions.addSection();
            } else if (alt) {
              SheetActions.addRow();
            } else {
              SheetActions.addBar();
            }
          }
          e.preventDefault();
          break;

        default:
          break;
      }
    },

    _gainedFocus: function() {
      SheetActions.storeChordRefAsSelected(this.props.id, this.props.parentIDs.toJS());
      this.setState({editing: true});
    },

    _lostFocus: function(e) {
      var text = this.getDOMNode().innerHTML;
      SheetActions.updateChordText(this.props.id, text);
      this.setState({editing: false, value: text});
    },


  });

  module.exports = ChordComponent;

}())
