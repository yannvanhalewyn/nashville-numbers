(function() {

  var React = require('react');
  var Bar = require('./bar.react');

  var Row = React.createClass({

    propTypes: {
      initialBars: React.PropTypes.array
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
    },

    renderBar: function(bar) {
      return <Bar key={bar.id} initialChords={bar.chords} />;
    },

    render: function() {
      return (
        <div className="musicRow" >
          {this.state.bars.map(this.renderBar)}
        </div>
      );
    }

  });

  module.exports = Row;

}())
