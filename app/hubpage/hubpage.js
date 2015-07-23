(function() {

  "use strict";

  var React    = require('react')
    , HubPage = require('./components/Hubpage.jsx')
    , HubStore = require('./stores/hubStore')

  React.render(
    <HubPage store={HubStore} />,
    document.getElementById('hubpage-container')
  );

}())
