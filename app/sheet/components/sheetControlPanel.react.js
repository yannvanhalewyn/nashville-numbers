(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var NetworkActions = require('../actions/networkActions');
  var SheetControlEditActions = require('./sheetControlEditActions.react');

  var $ = require('jquery');

  var SheetControlPanel = React.createClass({


    render: function() {
      return (
        <div className="sheet-control-panel">
          <form action="/sheets/559c1e68218c0216350b84e0" method="post" ref="deleteForm">
            <input type="hidden" value="DELETE" name="_method"/>
          </form>
          <span className="SC-icon fa fa-trash-o" onClick={this._handleDelete}></span>
          <span className="SC-icon fa fa-star-o" id="SC-fav-icon"></span>
          <SheetControlEditActions />
          <span className="fa fa-expand" id="play-mode-toggle"></span>
          <div className="btn" id="save-button" onClick={this._handleSave}>Save!</div>
        </div>
      )
    },

    _handleSave: function(e) {
      NetworkActions.save();
    },

    _handleDelete: function(e) {
      this.refs.deleteForm.getDOMNode().submit();
    }

  });

  module.exports = SheetControlPanel;

}())
