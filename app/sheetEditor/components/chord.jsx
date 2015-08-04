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
      parentIDs: React.PropTypes.object.isRequired,
      locked: React.PropTypes.bool,
      autoFocus: React.PropTypes.bool
    },

    getInitialState: function() {
      return {
        value: this.props.rawString,
        editing: false
      }
    },

    renderDisplayChord: function() {
      return <div className="chord-display" onClick={this._focus}>{this._musicNotationString()}</div>
    },

    renderInputBox: function() {
      return (
        <input
          className="chord-input"
          type="text"
          ref="inputBox"
          onChange={this._onChange}
          onFocus={this._gainedFocus}
          onBlur={this._lostFocus}
          onKeyDown={this._onKeyDown}
          value={this.state.value}
        />
      )
    },

    componentDidMount: function() { this.focusIfNeeded(); },

    componentDidUpdate: function() { this.focusIfNeeded(); },

    focusIfNeeded: function() {
      if (this.props.autoFocus) {
        // TODO is it bad to reset the flag directly on the props?
        // Should I have another flag?
        this.props.autoFocus = false;
        this._focus();
      }
    },

    render: function() {
      var classes = {
        'chord': true,
        'chord-editing': this.state.editing,
        'chord-empty': !this.state.value
      };
      return (
        <div className={classNames(classes)}>
          {!this.props.locked ? this.renderInputBox() : null}
          {!this.state.editing ? this.renderDisplayChord() : null}
        </div>
      )
    },

    _musicNotationString: function() {
      return new Chord(this.state.value).musicNotationString();
    },

    _onChange: function(e) {
      this.setState({value: e.target.value});
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
      SheetActions.updateChordText(this.props.id, e.target.value);
      this.setState({editing: false});
    },

    _focus: function() {
      this._inputBox().focus();
      this._inputBox().select();
    },

    // Lazy caching of the input box
    _inputBox: function() {
      if (!this.inputBox) {
        this.inputBox = this.refs.inputBox.getDOMNode();
      }
      return this.inputBox;
    }

  });

  module.exports = ChordComponent;

}())
