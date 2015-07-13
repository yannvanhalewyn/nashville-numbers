(function() {

  var Sheet = require('../models/sheet');

  module.exports = {

    // GET#index
    index: function(req, res) {
      req.user.sheets().then(function(sheets) {
        res.render('sheets', {sheets: sheets});
      });
    },

    edit: function(req, res) {
      // Get the requested sheet
      return Sheet.findById(req.params.sheet_id).then(function(sheet) {

        // Check if requester is the author
        return sheet.author().then(function(author) {
          if (req.user._id != author._id) {
            // Not the author: Redirect to sheets
            return res.redirect('/users/me/sheets');
          }
          // Author: render the edit template
          res.render('sheet', {state: sheet.properties.data, dbid: sheet._id});
        });

      // Catch any errors in finding the sheet or author (or elsewhere for the matter)
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
    update: function(req, res) {
      // Find the sheet by it's ID
      return Sheet.findById(req.params.sheet_id).then(function(sheet) {

        // Find the sheet's author TODO double db call
        return sheet.author().then(function(author) {

          // If the found sheet's author is the user
          if (author._id === req.user._id) {
            // Update the sheet with sent in params
            return sheet.update({
              title: req.body.main.title,
              artist: req.body.main.artist,
              data: JSON.stringify(req.body),
            })
            // Then respond with 200 if successfull
            .then(function() {
              return res.sendStatus(200);
            });

          // Else send a 403
          } else {
            res.status(403)
            return res.send("You're not the author of this sheet.");
          }
        });

      // Catches any errors in findById
      }).catch(function(err) {
        // If not found, 404 will be sent
        res.status(404);
        return res.send(err);
      });
    },

    // DELETE#destroy
    destroy: function(req, res) {
      // Find the sheet by it's ID
      Sheet.findById(req.params.sheet_id).then(function(sheet) {

        // Find the sheet's author
        sheet.author().then(function(author) {
          // If the found sheet's author is the user
          if (author._id === req.user._id) {
            // Destroy the sheet
            sheet.destroy().then(function() {
              // Redirect to the user's sheets page
              return res.redirect('/users/me/sheets');
            })

          // If he's not the author
          } else {
            res.status(403);
            return res.send("You're not the author of this sheet");
          }
        });

      // Error on sheet.findById = not found
      }, function(err) {
        res.sendStatus(404);
      })
    }
  };
}())
