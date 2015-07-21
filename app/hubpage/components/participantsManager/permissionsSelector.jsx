(function() {

  "use strict";

  var React      = require('react')
    , Ranks = require('../../../../models/permission').Ranks

  var PermissionsSelector = React.createClass({
    render: function() {
      var options = [];
      for (var name in Ranks) {
        options.push(
          <option value={Ranks[name]}>{name}</option>
        );
      }
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
