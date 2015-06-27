/** @jsx React.DOM */

var React = require('react');
var Sheet = require('../Components/sheet.react');

var SHEET = {
  id: 1,
  title: "My love",
  artist: "Mariah Carey",
  sections: [
    {
      id: 1,
      name: "intro",
      rows: [
        {
          id: 1,
          bars: [
            {
              id: 1,
              chords: [
                {id: 1, raw: "ebm7"},
                {id: 2, raw: "ab7"}
              ]
            },
            {
              id:2,
              chords: [
                {id: 3, raw: "bb7b9"},
                {id: 4, raw: "ab7"}
              ]
            },
            {
              id: 3,
              chords: [
                {id: 5, raw: "c#m"},
              ]
            },
            {
              id: 4,
              chords: [
                {id: 6, raw: "ab"}
              ]
            }
          ]
        },
        {
          id: 2,
          bars: [
            {
              id: 5,
              chords: [
                {id: 7, raw: "ab7"},
                {id: 8, raw: "gb"}
              ]
            },
            {
              id: 6,
              chords: [
                {id: 9, raw: "abmaj"},
                {id: 10, raw: "bb"}
              ]
            }
          ] // End of bars
        } // End of row
      ] // End of rows
    }, // End of section

    {
      id: 2,
      name: "verse",
      rows: [
        {
          id: 3,
          bars: [
            {
              id: 7,
              chords: [
                {id: 11, raw: "c#m"},
                {id: 12, raw: "ab"}
              ]
            },
            {
              id: 8,
              chords: [
                {id: 13, raw: "ab7"},
                {id: 14, raw: "F#m"}
              ]
            },
            {
              id: 9,
              chords: [
                {id: 15, raw: "bb7"},
                {id: 16, raw: "Dm"}
              ]
            }
          ] // End of bars
        } //End of row
      ] // End of rows
    } // End of section
  ] // End of sections
}

React.render(
  <Sheet initialSections={SHEET.sections} initialTitle={SHEET.title} initialArtist={SHEET.artist}/>,
  document.getElementById('sheet-container')
);
