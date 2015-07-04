(function() {

  var Sheet = require('../models/sheet');

  module.exports = {

    // INDEX
    index: function(req, res) {
      Sheet.find({}, function(err, data) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.render('sheets', {
            active: {active_sheets: true},
            sheets: data
          });
        }
      });
    },

    // SHOW
    show: function(req, res) {
      var id = req.params.id;
      Sheet.findById(req.params.id, function(err, sheet) {
        res.render('sheet', {active: {active_sheets: true}, state: sheet.data});
      });
    },

    // CREATE
    create: function(req, res) {
      var sheet = new Sheet({title: req.body.title, artist: req.body.artist,
                            data:_generateDefaultData(req.body.title, req.body.artist)});
      if (!req.body.title || !req.body.artist) {
        res.sendStatus('403');
        return;
      }
      sheet.save(function(err) {
        if (err) {
          console.log("ERROR!");
          console.log(err);
          res.sendStatus('500')
        }
        res.render('sheet', {
          active: {active_sheets: true},
          state: sheet.data
        });
      });
    }

  };

  function _generateDefaultData(title, artist) {
    return JSON.stringify({
      "entities": {
        "sections": {
          "section1": {
            "id": "section1",
            "name": "intro",
            "rows": [
              "row1"
            ]
          }
        },
        "rows": {
          "row1": {
            "id": "row1",
            "bars": [
              "bar1",
              "bar2",
              "bar3",
              "bar4"
            ]
          }
        },
        "bars": {
          "bar1": {
            "id": "bar1",
            "chords": ["chord1"]
          },
          "bar2": {
            "id": "bar2",
            "chords": ["chord2"]
          },
          "bar3": {
            "id": "bar3",
            "chords": ["chord3"]
          },
          "bar4": {
            "id": "bar4",
            "chords": ["chord4"]
          }
        },
        "chords": {
          "chord1": {
            "id": "chord1"
          },
          "chord2": {
            "id": "chord2"
          },
          "chord3": {
            "id": "chord3"
          },
          "chord4": {
            "id": "chord4"
          }
        }
      },
      "result": {
        "title": title,
        "artist": artist,
        "sections": [
          "section1"
        ]
      }
    })
  }

}())
