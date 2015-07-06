(function() {

  var Sheet = require('../models/sheet');

  module.exports = {

    // GET#INDEX
    index: function(req, res) {
      // Double check the user (if id exists but invalid, the error block
      // below will run
      if (!req.user || !req.user._id) return res.sendStatus(403);

      // Find sheets and render sheets templte
      return Sheet.find({authorID: req.user._id}).exec()
      .then(function(sheets) {
        res.render('sheets', {
          active: {active_sheets: true},
          sheets: sheets
        });
      }, function(err) {res.redirect('/')});
    },

    // GET#SHOW
    show: function(req, res) {
      // Double check again (this is just for peace of mind)
      if (!req.user || !req.user._id) return res.sendStatus(403);
      if (!req.params) return res.redirect('/sheets');

      // Find the sheet
      return Sheet.findById(req.params.id).exec()
      .then(function(sheet) {
        res.render('sheet', {active: {active_sheets: true}, state: sheet.data});
      }, function(err) {res.redirect('/')});
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
