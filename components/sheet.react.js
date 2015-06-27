(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Section = require('./section.react')

  Sheet = React.createClass({

    propTypes: {
      initialTitle: React.PropTypes.string,
      initialArtist: React.PropTypes.string,
      initialSections: React.PropTypes.array
    },

    getInitialState: function() {
      return {
        sections: this.props.initialSections,
        title: this.props.initialTitle,
        artist: this.props.initialArtist
      }
    },

    renderSection: function(section) {
      return <Section key={section.id} initialRows={section.rows} initialName={section.name} />
    },

    render: function() {
      return (
        <div className="sheet">
          <h1 className="sheet-title">
            {this.state.title} <small>{this.state.artist}</small>
          </h1>
          {this.state.sections.map(this.renderSection)}
        </div>
      )
    }
  });

  module.exports = Sheet;

}())
