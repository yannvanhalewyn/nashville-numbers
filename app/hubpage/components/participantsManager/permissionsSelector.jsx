(function() {

  "use strict";

  var React      = require('react')
    , Ranks = require('../../../../models/permission').Ranks

  var PermissionsSelector = React.createClass({
    renderOptions: function() {
      // Store an array of options based and set the correct selected flag
      return Object.keys(Ranks).map(function(rank) {
        var selected = Ranks[rank] == this.props.currentPermissions ? "selected" : "";
        return <option value={Ranks[rank]} selected={selected}>{rank}</option>
      }.bind(this));
    },

    render: function() {
      // Render the select node with the options
      return (
        <div className="permissions-selector">
          <select onChange={this._onChange}>
            {this.renderOptions()}
          </select>
        </div>
      )
    },

    _onChange: function(e) {
      this.props.onChange(e.target.value);
    }
  });

  module.exports = PermissionsSelector;

}())
