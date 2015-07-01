(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var SheetActions = require('../actions/sheetActions');

  var SheetControlPanel = React.createClass({

    renderAddOrRemoveButton: function(element, addHandler, removeHandler) {
      return (
        <div className="add-or-remove-buttons">
          <div className="btn button button-add" onClick={addHandler}>
            <span className="glyphicon glyphicon-plus"></span>
          </div>
          {element}
          <div className="btn button button-remove" onClick={removeHandler}>
            <span className="glyphicon glyphicon-minus"></span>
          </div>
        </div>
      )
    },

    render: function() {
      return (
        <div className="sheet-control-panel">
          {this.renderAddOrRemoveButton("Section", SheetActions.appendSection,
                                                   SheetActions.removeSection)}
          {this.renderAddOrRemoveButton("Row", SheetActions.appendRow,
                                               SheetActions.removeRow)}
          {this.renderAddOrRemoveButton("Bar", SheetActions.appendBar,
                                               SheetActions.removeBar)}
          {this.renderAddOrRemoveButton("Chord", SheetActions.appendChord,
                                                 SheetActions.removeChord)}
        </div>
      )
    },

  });

  module.exports = SheetControlPanel;

}())
