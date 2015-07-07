(function() {

  "use strict";

  var React = require('react');

  var Model = React.createClass({
    render: function() {
      return (
        <div className="outer-modal grid">
          <div className="modal skip-1-3 col-1-3">
            <h1>Some modal title</h1>
            <p>Some modal text</p>
            <div className="btn btn-red">No!</div>
            <div className="btn">OK!</div>
          </div>
        </div>
      )
    }
  });

  module.exports = Model;

}())
