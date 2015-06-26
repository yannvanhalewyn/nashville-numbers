/** @jsx React.DOM */

var React = require('react');
var Bar = require('../Components/bar.react');
var Chord = require('./chord');

var CHORDS = [new Chord("Ebm7"), new Chord("ab7"), new Chord("bb7b9")];

React.render(
  <Bar chords={CHORDS}/>,
  document.getElementById('sheet-container')
);
