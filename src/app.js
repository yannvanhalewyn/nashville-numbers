/** @jsx React.DOM */

var React = require('react');
var Sheet = require('../Components/sheet.react');

var data = JSON.parse(document.getElementById('initial-state').innerHTML);

setTimeout(function() {
  React.render(
    <Sheet initialSections={data.sections} initialTitle={data.title} initialArtist={data.artist}/>,
    document.getElementById('sheet-container')
  );
}, 3000);
