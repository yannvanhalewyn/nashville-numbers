(function() {

  var React = require('react');
  var Bar = require('./bar.react');

  var Row = React.createClass({

    propTypes: {
      bars: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
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
          {this.props.bars.map(this.renderBar)}
        </div>
      );
    },

  });

  module.exports = Row;

}())
