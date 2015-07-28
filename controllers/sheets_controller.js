(function() {

  var Sheet                    = require('../models/sheet')
    , ensureAuth               = require('../middlewares/auth')
    , getTargetSheetWithAuthor = require('../middlewares/sheets/getTargetSheetWithAuthor')
    , ensureAuthoredOrPublic   = require('../middlewares/sheets/ensureAuthoredOrPublic')
    , ensureAuthored           = require('../middlewares/sheets/ensureAuthored')

  module.exports = {

    middlewares: {
      index:   [ensureAuth],
      show:    [ensureAuth, getTargetSheetWithAuthor, ensureAuthoredOrPublic],
      edit:    [ensureAuth, getTargetSheetWithAuthor, ensureAuthored],
      create:  [ensureAuth],
      update:  [ensureAuth, getTargetSheetWithAuthor, ensureAuthored],
      destroy: [ensureAuth, getTargetSheetWithAuthor, ensureAuthored]
    },

    // GET#index
    index: function(req, res) {
      res.send("/sheets index");
    },

    show: function(req, res) {
      res.send("Sheet show page");
    },

    edit: function(req, res) {
      res.render('sheetEditor', {active_sheets: true, state: JSON.stringify(req.target_sheet)});
    },

    // POST#create
    create: function(req, res) {
      return req.user.createSheet(req.body).then(function(sheet) {
        res.redirect('/sheets/' + sheet._id + '/edit');
      });
    },

    // PUT#update
    update: function(req, res) {
      req.target_sheet.update({
        title: req.body.main.title,
        artist: req.body.main.artist,
        data: JSON.stringify(req.body),
      }).then(function(updatedSheet) {
        res.json(updatedSheet);
      });
    },

    // DELETE#destroy
    destroy: function(req, res) {
      req.target_sheet.destroy().then(function() {
        res.redirect("/users/me/sheets");
      });
    }
  };
}())
