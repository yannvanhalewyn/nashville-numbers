/** @jsx React.DOM */

(function() {

  var RETURN_KEYCODE = 13;
  var TAB_KEYCODE = 9

  var React = require('react');
  var Chord = require('./chord.react');
  var ChordModel = require('../chord.js');
  var SheetActions = require('../actions/sheetActions');

  Bar = React.createClass({

    propTypes: {
      chords: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentID: React.PropTypes.string.isRequired
    },

    renderChord: function(chord) {
      return <Chord
                key={chord.id}
                rawString={chord.raw}
                id={chord.id}
                parentID={this.props.id}
              />
    },

    render: function() {
      return (
        <div onKeyDown={this._onKeyDown} className="bar">
          {this.props.chords.map(this.renderChord)}
        </div>
      );
    },

    _onKeyDown: function(e) {
      if (e.keyCode == RETURN_KEYCODE) {
        e.preventDefault();
        SheetActions.appendNewBar(this.props.id, this.props.parentID);
      }
    }

  });

  module.exports = Bar;

}())
