(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var Section = require('./section.jsx')

  var Sheet = React.createClass({

    propTypes: {
      sections: React.PropTypes.array
    },

    renderSection: function(section) {
      return <Section key={section.id} rows={section.rows} name={section.name} id={section.id} />
    },

    render: function() {
      return (
        <div className="sheet">
          {this.props.sections.map(this.renderSection)}
        </div>
      );
    }

  });

  module.exports = Sheet;

}())
