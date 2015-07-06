(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var NetworkActions = require('../actions/networkActions');
  var SheetControlEditActions = require('./sheetControlEditActions.react');

  var SheetControlPanel = React.createClass({


    render: function() {
      return (
        <div className="sheet-control-panel">
          <span className="SC-icon fa fa-trash-o"></span>
          <span className="SC-icon fa fa-star-o" id="SC-fav-icon"></span>
          <SheetControlEditActions />
          <span className="fa fa-expand" id="play-mode-toggle"></span>
          <div className="btn" id="save-button" onClick={this._handleSave}>Save!</div>
        </div>
      )
    },

    _handleSave: function(e) {
      NetworkActions.save();
    }

  });

  module.exports = SheetControlPanel;

}())
