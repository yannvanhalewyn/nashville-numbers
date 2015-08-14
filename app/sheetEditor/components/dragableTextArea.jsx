(function() {

  "use strict";

  var React = require('react')
    , Dragable = require('../../utility_react_components/dragable.jsx')
    , Actions = require('../actions/dragAndDropActions').actions;

  var DragableTextArea = React.createClass({
    render: function() {
      return (
        <Dragable onDragStart={this._onDragStart} onDrop={this._onDrop}>
          <textArea>Text</textArea>
        </Dragable>
      );
    },

    _onDragStart: function() {
      Actions.dragStart();
    },

    _onDrop: function() {
      Actions.dropped();
    }
  });

  module.exports = DragableTextArea;

}())
