
var React = require('react')
  , HubsPage = require('./components/hubspage.jsx')
  , HubsStore = require('./stores/hubsstore')

React.render(
  <HubsPage store={HubsStore} />,
  document.getElementById('hubspage-container')
);

