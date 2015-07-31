(function() {

  var React = require('react');
  var Bar = require('./bar.jsx');

  var Row = React.createClass({

    propTypes: {
      bars: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
    },

    renderSymbolsRow: function() {
      return (
        <div className="symbol-container">
          <span className="segno">@</span>
          <span className="coda">Ø</span>
        </div>
      )
    },

    renderBar: function(bar) {
      return <Bar
             key={bar.id}
             chords={bar.chords}
             id={bar.id}
             parentIDs={this.props.parentIDs.set('rowID', this.props.id)}
           />;
    },

    render: function() {
      return (
        <div className="row" >
          <div className="symbols">
            {this.props.bars.map(this.renderSymbolsRow)}
          </div>
          <div className="bars">
            {this.props.bars.map(this.renderBar)}
          </div>
        </div>
      );
    },

  });

  module.exports = Row;

}())
