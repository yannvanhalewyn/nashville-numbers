
/** @jsx React.DOM */

(function() {

  var RETURN_KEYCODE = 13;
  var TAB_KEYCODE = 9

  var React = require('react');
  var Chord = require('./chord.jsx');
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

    render: function() {
      var classes = classNames({
        bar: true,
        "multi-chords": this.props.chords.length > 1
      });
      var repetitionLeft = "<use xlink:href='#repetition-left' />";
      var repetitionRight = "<use xlink:href='#repetition-right' />";
      return (
          <span className={classes}>
            <div className="repeat-left">
              <svg viewbox="0 0 100 100" dangerouslySetInnerHTML={{__html: repetitionLeft}} />
            </div>
            <div className="chords">
              {this.props.chords.map(this.renderChord)}
            </div>
            <div className="repeat-right">
              <svg viewbox="0 0 100 100" dangerouslySetInnerHTML={{__html: repetitionRight}} />
            </div>
          </span>
      );
    }

  });

  module.exports = Bar;

}())
