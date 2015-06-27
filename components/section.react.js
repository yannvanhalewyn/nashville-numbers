(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Row = require('./row.react')

  var Section = React.createClass({

    propTypes: {
      initialRows: React.PropTypes.array,
      initialName: React.PropTypes.string
    },

    getInitialState: function() {
      return {
        rows: this.props.initialRows,
        name: this.props.initialName
      }
    },

    renderRow: function(row) {
      console.log(row);
      return <Row key={row.id} initialBars={row.bars} />
    },

    render: function() {
      return (
        <div className="section">
          <h2 className="section-name">{this.state.name}</h2>
          {this.state.rows.map(this.renderRow)}
        </div>
      );
    }
  });

  module.exports = Section;

}())
