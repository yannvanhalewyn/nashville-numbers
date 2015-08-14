(function() {

  "use strict";

  var React = require('react');

  // TODO check the bg of the span and children, no match!
  // TODO should make div.sheet position relative for it to stay in scroll
  // bounds. Left/top recalculation will be needed :(
  var Dragable = React.createClass({
    render: function() {
      return (
        <span style={this.style()} onMouseDown={this._onMouseDown} >
          {this.props.children}
        </span>
      )
    },

    style: function() {
      if (this.state && this.state.dragging) {
        return {
          position: "absolute",
          left: this.state.left,
          top: this.state.top,
          "pointer-events": "none",
          opacity: 0.5
        }
      }
      return {};
    },

    _onMouseDown: function(e) {
      var pageOffset = this.getDOMNode().getBoundingClientRect();
      this.setState({
        dragStart: {x: event.pageX, y: event.pageY},
        element: {x: pageOffset.left, y: pageOffset.top}
      });
      if (typeof this.props.onDragStart === "function") this.props.onDragStart();
      this._addEvents();
    },

    _onMouseMove: function(e) {
      var deltaX = e.pageX - this.state.dragStart.x;
      var deltaY = e.pageY - this.state.dragStart.y;
      this.setState({
        dragging: true,
        left: this.state.element.x + deltaX + document.body.scrollLeft,
        top: this.state.element.y + deltaY + document.body.scrollTop
      });
    },

    _onMouseUp: function() {
      this.setState({dragging: false});
      if (typeof this.props.onDrop === "function") this.props.onDrop();
      this._removeEvents();
    },

    _addEvents: function() {
      document.addEventListener('mousemove', this._onMouseMove);
      return document.addEventListener('mouseup', this._onMouseUp);
    },

    _removeEvents: function() {
      document.removeEventListener('mousemove', this._onMouseMove);
      return document.removeEventListener('mouseup', this._onMouseUp);
    }

  });

  module.exports = Dragable;

}())
