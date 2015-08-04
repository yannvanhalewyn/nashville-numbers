(function() {

  var React = require('react');
  var Bar = require('./bar.jsx');

  var Row = React.createClass({

    propTypes: {
      bars: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired,
      focusTargetID: React.PropTypes.string
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
    },

    renderSymbolsRow: function(bar) {
      return (
        <div key={bar.id + "s"} className="symbol-container">
          {bar.segno ? <span className="segno">@</span> : null }
          {bar.coda ? <span className="coda">Ø</span> : null }
        </div>
      )
    },

    renderBar: function(bar) {
      return (
        <Bar
          key={bar.id}
          chords={bar.chords}
          id={bar.id}
          parentIDs={this.props.parentIDs.set('rowID', this.props.id)}
          repeatLeft={bar.repeatLeft}
          repeatRight={bar.repeatRight}
          locked={this.props.locked}
          focusTargetID={this.props.focusTargetID}
        />
      )
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
