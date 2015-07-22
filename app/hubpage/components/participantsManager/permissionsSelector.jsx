(function() {

  "use strict";

  var React      = require('react')
    , Ranks = require('../../../../models/permission').Ranks

  var PermissionsSelector = React.createClass({
    render: function() {

      // Store an array of options based and set the correct selected flag
      var options = [];
      for (var name in Ranks) {
        var selected = Ranks[name] == this.props.currentPermissions ? "selected" : "";
        options.push(
          <option value={Ranks[name]} selected={selected}>{name}</option>
        );
      }

      // Render the select node with the options
      return (
        <select onChange={this._onChange}>
          {options}
        </select>
      )
    },

    _onChange: function(e) {
      this.props.onChange(e.target.value);
    }
  });

  module.exports = PermissionsSelector;

}())
