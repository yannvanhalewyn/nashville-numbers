(function() {

  // TODO Maybe put validateMandatoryFields(req, field) in own handle error
  // method, and then redirect or respond based on the error. That method could
  // be put at the end of the promise chain
  // NOTE Currently I feel like big violator of SRP. Every method is performing
  // too many checks on the params. I should extract all the validation logic to
  // middleware, and write specs for those.
  var Sheet = require('../models/sheet');

  module.exports = {

    // GET#index
    index: function(req, res) {
      req.user.sheets().then(function(sheets) {
        res.render('sheets', {sheets: sheets});
      });
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
        return res.render('sheet', { active_sheets: true, state: sheet.data,
                                readOnly: !isAuthor });
      }, function(err) {res.redirect('/')});
    },

    edit: function(req, res) {
      return Sheet.findById(req.params.sheet_id).then(function(sheet) {
        res.render('sheet', {state: sheet.properties.data});
      }).catch(function(err) {
        res.redirect('/users/me/sheets'); // Not found
      });
    },

    // POST#create
    create: function(req, res) {
      return req.user.createSheet(req.body).then(function(sheet) {
        res.redirect('/users/me/sheets/' + sheet._id + '/edit');
      }).catch(console.error);
    },

    // PUT#update
    // TODO get rid of those 24bit hex regexes!
    // mongoose query promises wont hand me error callbacks for some reason.. :(
    update: function(req, res) {
      // Validate params. Is this necessary?
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
        if (req.accepts('html')) return res.redirect('/sheets');
        res.status(200);
        return req.user.sheets.then(res.send);
      }, function(err) {
        return res.sendStatus(401);
      });
    }
  };
}())
