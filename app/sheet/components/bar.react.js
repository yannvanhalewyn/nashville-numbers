/** @jsx React.DOM */

(function() {

  var RETURN_KEYCODE = 13;
  var TAB_KEYCODE = 9

  var React = require('react');
  var Chord = require('./chord.react');
  var ChordModel = require('../chord.js');
  var SheetActions = require('../actions/sheetActions');
  var classNames = require('classnames');

  Bar = React.createClass({

    propTypes: {
      chords: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired
    },

    renderChord: function(chord) {
      return <Chord
                key={chord.id}
                rawString={chord.raw}
                id={chord.id}
                parentIDs={this.props.parentIDs.set('barID', this.props.id)}
              />
    },

    // TODO auto delete bars when emptied
    render: function() {
      var classes = classNames({
        bar: true,
        "bar-with-multiple-chords": this.props.chords.length > 1
      });
      return (
        <div onKeyDown={this._onKeyDown} className={classes}>
          {this.props.chords.map(this.renderChord)}
        </div>
      );
    },

    _onKeyDown: function(e) {
      if (e.keyCode == RETURN_KEYCODE) {
        e.preventDefault();
        SheetActions.appendNewBar(this.props.id, this.props.parentIDs.rowID);
      }
    }

  });

  module.exports = Bar;

}())
