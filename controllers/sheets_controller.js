(function() {

  var include                  = require('include')
    , Sheet                    = include('/models/sheet')
    , ensureAuth               = include('/middlewares/auth')
    , getTargetSheetWithAuthor = include('/middlewares/sheets/getTargetSheetWithAuthor')
    , ensureAuthoredOrPublic   = include('/middlewares/sheets/ensureAuthoredOrPublic')
    , ensureAuthored           = include('/middlewares/sheets/ensureAuthored')
    , redirect                 = include('/middlewares/errors/redirect')
    , errorStatus              = include('/middlewares/errors/errorStatus')

  module.exports = {

    middlewares: {
      index:   [ensureAuth],
      show:    [ensureAuth, getTargetSheetWithAuthor, ensureAuthoredOrPublic, redirect.sheets],
      edit:    [ensureAuth, getTargetSheetWithAuthor, ensureAuthored, redirect.sheets],
      create:  [ensureAuth],
      update:  [ensureAuth, getTargetSheetWithAuthor, ensureAuthored, errorStatus(500)],
      destroy: [ensureAuth, getTargetSheetWithAuthor, ensureAuthored, redirect.sheets]
    },

    // GET#index
    index: function(req, res) {
      res.send("/sheets index");
    },

    show: function(req, res) {
      res.render("sheet", {active_sheets: true, data: req.target_sheet.properties.data});
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
