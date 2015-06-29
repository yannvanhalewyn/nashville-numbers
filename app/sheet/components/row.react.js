(function() {

  var React = require('react');
  var Bar = require('./bar.react');
  var SheetStore = require('../stores/sheetStore');

  var Row = React.createClass({

    propTypes: {
      initialBars: React.PropTypes.array
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
    },

    renderBar: function(bar) {
      return <Bar key={bar.id} chords={bar.chords.map(SheetStore.getChord)} />;
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
