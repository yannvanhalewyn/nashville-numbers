(function() {

  var Sheet = require('../models/sheet');

  module.exports.controller = function(app) {

    // INDEX
    app.get('/sheets', function(req, res) {
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
    });

    // SHOW
    app.get('/sheets/:id', function(req, res) {
      var id = req.params.id;
      if (parseInt(id) === 15) {
        res.redirect('/');
      } else {
        res.render('sheets', {active: {active_sheets: true}, num: req.params.id});
      }
    });

    // CREATE
    app.post('/sheets', function(req, res) {
      var sheet = new Sheet({title: req.body.title, artist: req.body.artist, data:""});
      if (!req.body.title || !req.body.artist) {
        console.log("Forbidden - no title or artist");
        res.sendStatus('403');
        return;
      }
      sheet.save(function(err) {
        if (err) {
          console.log("ERROR!");
          console.log(err);
        }
      });
      res.send('created!');
    })

  };

}())
