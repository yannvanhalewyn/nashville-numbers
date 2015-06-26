/** @jsx React.DOM */

var React = require('react');
var Bar = require('./Components/bar.react');

var CHORDS = ["em7", "ab7", "bb7b9"];

React.render(
  <Bar chords={CHORDS}/>,
  document.getElementById('sheet-container')
);
