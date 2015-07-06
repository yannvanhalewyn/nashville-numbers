(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var $ = require('jquery');
  var SheetActions = require('../actions/sheetActions');
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
      $.ajax({
        url: window.location.pathname,
        method: "PUT",
        contentType: 'application/json',
        success: function(result) {
          console.log("IN SUCCESS BLOCK");
          console.log(res);
        },
        error: function(err) {
          console.log("IN ERR BLOCK");
          console.log(err);
        },
        data: '{"main": {"title": "anotherTitle", "artist": "artist", "sections": []}}'
      }).done(function(res) {
        console.log("IN DONE BLOCK");
        if (res.status == 200) {
          alert("saved!")
        } else {
          alert("error!")
          console.log(res.error());
        }
      }).error(function(err) {
        console.log("IN ERR PROMISE");
        alert("error!");
        console.log(err);
      })
    }

  });

  module.exports = SheetControlPanel;

}())
