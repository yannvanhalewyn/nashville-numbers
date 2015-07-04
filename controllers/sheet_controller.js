(function() {

  var Sheet = require('../models/sheet');

  module.exports.controller = function(app) {

    app.get('/sheets', function(req, res) {
      res.render('sheets', {active: {active_sheets: true}});
    });

    app.get('/sheets/:id', function(req, res) {
      var id = req.params.id;
      if (parseInt(id) === 15) {
        res.redirect('/');
      } else {
        res.render('sheets', {active: {active_sheets: true}, num: req.params.id});
      }
    });

    app.get('/sheets/new', function(req, res) {
      res.send("NEW SHEET");
    });

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
