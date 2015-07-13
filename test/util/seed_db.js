(function() {

  "use strict";

  var Factory = require('./factory');

  // Create 2 users: userA and userB. Each of them has 2 sheets, a public and a
  // private one.
  // We now have this.userA, this.userB, this.sheets.userA, this.sheets.userB as refs
  var seed = function() {
    this.sheets = {};
    return Factory('sheet').then(function(objs) {
      this.userA = objs.user;
      this.sheets.userA = [objs.sheet];
      return Factory('sheet', {uid: this.userA._id, visibility: 'private', data: "FOOBAR"})
      .then(function(sheet2) {
        this.sheets.userA.push(sheet2);
        return Factory('sheet').then(function(objs) {
          this.userB = objs.user;
          this.sheets.userB = [objs.sheet];
          return Factory('sheet', {uid: this.userB._id, visibility: 'private'})
          .then(function(privateSheet) {
            this.sheets.userB.push(privateSheet);
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this))
  }

  module.exports = seed;

}())
