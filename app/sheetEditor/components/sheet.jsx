(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var Section = require('./section.jsx')

  var Sheet = React.createClass({

    propTypes: {
      sections: React.PropTypes.array,
      focusTargetID: React.PropTypes.string,
      dndStore: React.PropTypes.object
    },

    componentWillMount: function() {
      this.props.dndStore.on('dragStart', this._onDragStart);
      this.props.dndStore.on('drop', this._onDrop);
    },

    componentWillUnMount: function() {
      this.props.dndStore.off('dragStart', this._onDragStart);
      this.props.dndStore.off('drop', this._onDrop);
    },

    _onDragStart: function(dragItem) {
      this.setState({currentlyDragging: true, dragItem: dragItem});
    },

    _onDrop: function() {
      this.setState({currentlyDragging: false});
    },

    renderSection: function(section) {
      return (
        <Section
          key={section.id}
          rows={section.rows}
          name={section.name}
          id={section.id}
          focusTargetID={this.props.focusTargetID}
          currentlyDragging={this.state && this.state.currentlyDragging}
          dragItem={this.state ? this.state.dragItem : null}
        />
      )
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
