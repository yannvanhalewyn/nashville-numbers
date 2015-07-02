(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var SheetActions = require('../actions/sheetActions');

  var SheetControlPanel = React.createClass({

    renderAddOrRemoveButton: function(element, addHandler, removeHandler) {
      return (
        <div className="add-or-remove-buttons">
          <div className="btn control-add" onClick={addHandler}>
            <span className="fa fa-plus"></span>
          </div>
          <span className="control-target">{element}</span>
          <div className="btn control-remove" onClick={removeHandler}>
            <span className="fa fa-minus"></span>
          </div>
        </div>
      )
    },

    render: function() {
      return (
        <div className="sheet-control-panel">
          {this.renderAddOrRemoveButton("Section", SheetActions.addSection,
                                                   SheetActions.removeSection)}
          {this.renderAddOrRemoveButton("Row", SheetActions.addRow,
                                               SheetActions.removeRow)}
          {this.renderAddOrRemoveButton("Bar", SheetActions.addBar,
                                               SheetActions.removeBar)}
          {this.renderAddOrRemoveButton("Chord", SheetActions.addChord,
                                                 SheetActions.removeChord)}
        </div>
      )
    },

  });

  module.exports = SheetControlPanel;

}())
