(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Row = require('./row.react')

  var Section = React.createClass({

    propTypes: {
      section: React.PropTypes.array,
      name: React.PropTypes.string,
      id: React.PropTypes.string.isRequired
    },

    renderRow: function(row) {
      return <Row key={row.id} bars={row.bars} id={row.id}/>
    },

    render: function() {
      return (
        <div className="section">
          <h2 className="section-name">{this.props.name}</h2>
          {this.props.rows.map(this.renderRow)}
        </div>
      );
    }
  });

  module.exports = Section;

}())
