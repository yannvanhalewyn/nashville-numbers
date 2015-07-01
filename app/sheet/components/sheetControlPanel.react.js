(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');

  var SheetControlPanel = React.createClass({

    renderAddOrRemoveButton: function(element, addHandler, removeHandler) {
      return (
        <div className="add-or-remove-buttons">
          <button className="button button-add" onClick={addHandler}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
          {element}
          <button className="button button-remove" onClick={removeHandler}>
            <span className="glyphicon glyphicon-minus"></span>
          </button>
        </div>
      )
    },

    render: function() {
      return (
        <div className="sheet-control-panel">
          {this.renderAddOrRemoveButton("Section", this._onAddSection, this._onRemoveSection)}
          {this.renderAddOrRemoveButton("Row", this._onAddRow, this._onRemoveRow)}
          {this.renderAddOrRemoveButton("Bar", this._onAddBar, this._onRemoveBar)}
        </div>
      )
    },


  });

  module.exports = SheetControlPanel;

}())
