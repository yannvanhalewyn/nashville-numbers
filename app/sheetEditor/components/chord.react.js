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

    // clearAndFocusInput: function() {
    //   this.setState({userInput: ''}, function() {
    //     React.findDOMNode(this.refs.textInput).focus();
    //   });
    // },
    //
    componentDidMount: function() {
      this.getDOMNode().focus();
    },

    render: function() {
      var classes = {
        'chord': true,
        'chord-editing': this.state.editing,
        'chord-empty': !this.state.value
      };
      return (
        <input
          type="text"
          className={classNames(classes)}
          onChange={this._onChange}
          onFocus={this._gainedFocus}
          onBlur={this._lostFocus}
          onKeyDown={this._onKeyDown}
          value={this.state.editing ? this.state.value :
            this._musicNotationString()}
        />
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

    _onDoubleClick: function(e) {
      alert("Double Click! " + this.state.value);
    },

    _gainedFocus: function() {
      SheetActions.storeChordRefAsSelected(this.props.id, this.props.parentIDs.toJS());
      this.setState({editing: true});
    },

    _lostFocus: function() {
      SheetActions.updateChordText(this.props.id, this.state.value);
      this.setState({editing: false});
    },


  });

  module.exports = ChordComponent;

}())
