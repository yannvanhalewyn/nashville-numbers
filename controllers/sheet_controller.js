(function() {

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
      console.log(req.body.title);
      res.send('created!');
    })

  };

}())
