(function() {

  var React = require('react');
  var SheetActions = require('../actions/sheetActions');

  var SheetControlEditActions = React.createClass({

    getInitialState: function() {
      return {visible: false}
    },

    renderAddOrRemoveButton: function(element, addHandler, removeHandler) {
      return (
        <div className="add-or-remove-buttons">
          <div className="btn control-remove" onClick={removeHandler}>
            <span className="fa fa-minus"></span>
          </div>
          <span className="control-target">{element}</span>
          <div className="btn control-add" onClick={addHandler}>
            <span className="fa fa-plus"></span>
          </div>
        </div>
      )
    },

    renderDropDown: function() {
      if (!this.state.visible) return null;
      return (
        <div className="sheet-operations-popup">
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

    render: function() {
      return (
        <div className="SC-edit-actions SC-icon" onMouseLeave={this._onMouseLeave}>
          <span
            className="fa fa-pencil"
            onMouseEnter={this._openPopup}
            onClick={this._openPopup}>
          </span>
          {this.renderDropDown()}
        </div>
      )
    },

    _openPopup: function() {
      this.setState({visible: true});
    },

    _onMouseLeave: function() {
      this.setState({visible: false});
    }

  });

  module.exports = SheetControlEditActions;

}())
