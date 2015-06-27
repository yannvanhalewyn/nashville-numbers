/** @jsx React.DOM */

var React = require('react');
var Sheet = require('../Components/sheet.react');
var Chord = require('./chord');

var CHORDS1 = [new Chord("Ebm7"), new Chord("ab7"), new Chord("bb7b9")];
var CHORDS2 = [new Chord("ab7"), new Chord("bbm7"), new Chord("c#m")];
var BARS = [CHORDS1, CHORDS2];

React.render(
  <Sheet bars={BARS} title="It's a wonderful world" artist="Jessica Simpson"/>,
  document.getElementById('sheet-container')
);
