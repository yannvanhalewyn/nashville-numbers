#!/usr/bin/env node

var mongoose = require('mongoose');
var Sheet = require('../models/sheet');
mongoose.connect('mongodb://localhost/nashville_numbers');

for (var i = 0; i < 20; i++) {
  var sheet = new Sheet({title: "Seed" + i, artist: "Artist" + i, data: _generateData()})
  sheet.save(function(err) {
    if(err) console.error(err);
  });
}

function _generateData() {
  return JSON.stringify({
    "entities": {
      "sections": {
        "14355505517067hr5": {
          "id": "14355505517067hr5",
          "name": "intro",
          "rows": [
            "14355505517085o50",
            "1435550551709dtar"
          ]
        },
        "143555055170974wr": {
          "id": "143555055170974wr",
          "name": "verse",
          "rows": [
            "1435550551709la2m"
          ]
        }
      },
      "rows": {
        "14355505517085o50": {
          "id": "14355505517085o50",
          "bars": [
            "14355505517087ejf",
            "143555055170921vl",
            "1435550551709ilvw",
            "1435550551709ho6f"
          ]
        },
        "1435550551709dtar": {
          "id": "1435550551709dtar",
          "bars": [
            "1435550551709irhw",
            "1435550551709ekvf"
          ]
        },
        "1435550551709la2m": {
          "id": "1435550551709la2m",
          "bars": [
            "1435550551709z75",
            "1435550551709204h",
            "14355505517099i9c"
          ]
        }
      },
      "bars": {
        "14355505517087ejf": {
          "id": "14355505517087ejf",
          "chords": [
            "14355505517091w0d",
            "1435550551709chra"
          ]
        },
        "143555055170921vl": {
          "id": "143555055170921vl",
          "chords": [
            "1435550551709aseo",
            "1435550551709358n"
          ]
        },
        "1435550551709ilvw": {
          "id": "1435550551709ilvw",
          "chords": [
            "143555055170926l"
          ]
        },
        "1435550551709ho6f": {
          "id": "1435550551709ho6f",
          "chords": [
            "1435550551709esey"
          ]
        },
        "1435550551709irhw": {
          "id": "1435550551709irhw",
          "chords": [
            "143555055170930hb",
            "1435550551709118j"
          ]
        },
        "1435550551709ekvf": {
          "id": "1435550551709ekvf",
          "chords": [
            "1435550551709f1nb",
            "14355505517094bzp"
          ]
        },
        "1435550551709z75": {
          "id": "1435550551709z75",
          "chords": [
            "1435550551709elpu",
            "1435550551709gn6z"
          ]
        },
        "1435550551709204h": {
          "id": "1435550551709204h",
          "chords": [
            "14355505517099qx",
            "1435550551709d5ay"
          ]
        },
        "14355505517099i9c": {
          "id": "14355505517099i9c",
          "chords": [
            "14355505517096gpn",
            "14355505517091nib"
          ]
        }
      },
      "chords": {
        "14355505517091w0d": {
          "id": "14355505517091w0d",
          "raw": "ebm7"
        },
        "1435550551709chra": {
          "id": "1435550551709chra",
          "raw": "ab7"
        },
        "1435550551709aseo": {
          "id": "1435550551709aseo",
          "raw": "bb7b9"
        },
        "1435550551709358n": {
          "id": "1435550551709358n",
          "raw": "ab7"
        },
        "143555055170926l": {
          "id": "143555055170926l",
          "raw": "c#m"
        },
        "1435550551709esey": {
          "id": "1435550551709esey",
          "raw": "ab"
        },
        "143555055170930hb": {
          "id": "143555055170930hb",
          "raw": "ab7"
        },
        "1435550551709118j": {
          "id": "1435550551709118j",
          "raw": "gb"
        },
        "1435550551709f1nb": {
          "id": "1435550551709f1nb",
          "raw": "abmaj"
        },
        "14355505517094bzp": {
          "id": "14355505517094bzp",
          "raw": "bb"
        },
        "1435550551709elpu": {
          "id": "1435550551709elpu",
          "raw": "c#m"
        },
        "1435550551709gn6z": {
          "id": "1435550551709gn6z",
          "raw": "ab"
        },
        "14355505517099qx": {
          "id": "14355505517099qx",
          "raw": "ab7"
        },
        "1435550551709d5ay": {
          "id": "1435550551709d5ay",
          "raw": "F#m"
        },
        "14355505517096gpn": {
          "id": "14355505517096gpn",
          "raw": "bb7"
        },
        "14355505517091nib": {
          "id": "14355505517091nib",
          "raw": "Dm"
        }
      }
    },
    "result": {
      "title": "Baby",
      "artist": "Justin Bieber",
      "sections": [
        "14355505517067hr5",
        "143555055170974wr"
      ]
    }
  });
}
