/** @jsx React.DOM */

var React = require('react');
var Sheet = require('../Components/sheet.react');

data = JSON.parse(document.getElementById('initial-state').innerHTML);

React.render(
  <Sheet initialSections={data.sections} initialTitle={data.title} initialArtist={data.artist}/>,
  document.getElementById('sheet-container')
);

