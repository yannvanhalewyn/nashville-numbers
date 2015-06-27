(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Bar = require('./bar.react')

  Sheet = React.createClass({

    getInitialState: function() {
      return {
        bars: this.props.bars,
        title: this.props.title,
        artist: this.props.artist
      }
    },

    render: function() {
      var barComponents = this.state.bars.map(function(bar) {
        return (
          <Bar key={Math.random()} chords={bar} />
        )
      });
      return (
        <div className="sheet">
          <h1 className="sheet-title">
            {this.state.title} <small>{this.state.artist}</small>
          </h1>
          {barComponents}
        </div>
      )
    }
  });

  module.exports = Sheet;

}())
