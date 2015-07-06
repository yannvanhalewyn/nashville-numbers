(function() {

  // TODO Maybe put validateMandatoryFields(req, field) in own handle error
  // method, and then redirect or respond based on the error. That method could
  // be put at the end of the promise chain
  var Sheet = require('../models/sheet');

  module.exports = {

    // GET#index
    index: function(req, res) {
      console.log("INDEX");
      // Double check the user (if id exists but invalid, the error block
      // below will run
      if (!req.user) return res.sendStatus(422);
      if (!req.user._id) return res.sendStatus(401);

      // Find sheets and render sheets templte
      return Sheet.find({authorID: req.user._id}).exec()
      .then(function(sheets) {
        res.render('sheets', {
          active: {active_sheets: true},
          sheets: sheets
        });
      }, function(err) {res.redirect('/')});
    },

    // GET#show
    show: function(req, res) {
      // Double check again (this is just for peace of mind)
      if (!req.user) return res.sendStatus(422);
      if (!req.user._id) return res.sendStatus(401);
      if (!req.params) return res.redirect('/sheets');

      // Find the sheet
      return Sheet.findById(req.params.id).exec()
      .then(function(sheet) {
        var isAuthor = sheet.authorID.equals(req.user._id);
        if ((!isAuthor) && sheet.visibility === 'private') {
          return res.redirect('/sheets');
        }
        return res.render('sheet', { active: {active_sheets: true}, state: sheet.data,
                                readOnly: !isAuthor });
      }, function(err) {res.redirect('/')});
    },

    // POST#create
    create: function(req, res) {
      if (!req.body.title) return res.sendStatus(400);
      if (!req.user) return res.sendStatus(403);
      return new Sheet({
        title: req.body.title,
        artist: req.body.artist,
        authorID: req.user._id,
      }).save()
      .then(function(newSheet) {
        var url = ('/sheets/' + newSheet._id).toString();
        res.redirect(url);
      }, function(err) { res.redirect('/home'); });
    },

    // PUT#update
    // TODO get rid of those 24bit hex regexes!
    // mongoose query promises wont hand me error callbacks for some reason.. :(
    update: function(req, res) {
      // Validate params
      if(!req.params || !req.body || !req.user) return res.sendStatus(422);
      if(!/^([a-fA-F0-9]){24}$/.test(req.params.id)) return res.sendStatus(404);
      if(!/^([a-fA-F0-9]){24}$/.test(req.user._id)) return res.sendStatus(401);
      if(!req.body.main) return res.sendStatus(406);

      return Sheet.update(
        {_id: req.params.id, authorID: req.user._id},
        {$set: {
          data: JSON.stringify(req.body),
          title: req.body.main.title,
          artist: req.body.main.artist
        }}
      ).exec()
      .then(function(db_response) {
        db_response.n === 0 ? res.sendStatus(403) : res.status(200).send('foo');
      });
    },

    // DELETE#destroy
    destroy: function(req, res) {
      if(!req.params || !req.user) return res.sendStatus(422);
      return Sheet.remove({_id: req.params.id, authorID: req.user._id}).exec()
      .then(function(db_response) {
        if (db_response.result.n === 0) return res.sendStatus(404);
        return res.redirect('/sheets');
      }, function(err) {
        return res.sendStatus(401);
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
