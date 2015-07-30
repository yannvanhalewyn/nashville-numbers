(function() {

  "use strict";

  var React              = require('react')
    , UserPage           = require('./components/userpage.jsx')
    , UserStore          = require('./stores/userStore')

  React.render(
    <UserPage store={UserStore} />,
    document.getElementById('userpage-container')
  );

}())
