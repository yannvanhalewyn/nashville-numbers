(function() {

  var React = require('react');
  var Bar = require('./bar.react');

  var Row = React.createClass({

    propTypes: {
      bars: React.PropTypes.array,
      id: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
    },

    renderBar: function(bar) {
      return <Bar key={bar.id} chords={bar.chords} id={bar.id}/>;
    },

    render: function() {
      return (
        <div className="musicRow" >
          {this.props.bars.map(this.renderBar)}
        </div>
      );
    }

  });

  module.exports = Row;

}())
