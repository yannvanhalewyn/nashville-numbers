(function() {

  "use strict";

  var _ = require('lodash');

  /*
   * Permissions are based of UNIX style file permissions: by binary bit shift operations.

   *   ┌───────────  Hub settings related permissions
   *   │
   *   │    ┌──────  Participants related permissions
   *   │    │
   *   │    │    ┌─  Sheet related permissions
   *   │    │    │
   * ──┴─ ──┴─ ──┴─
   * 0000 0000 0000
   *    │  │││   │└─ Editing sheets
   *    │  │││   └── Adding/deleting sheets
   *    │  │││
   *    │  ││└────── Inviting users
   *    │  │└─────── Revoking Users
   *    │  └──────── Managing user permissions
   *    │
   *    └─────────── Managing Hub settings
   *
   * I've left some free spots in the 12-bit permission representation to allow
   * for future expansions on the matter.
   */

  // Permissions
  var NONE                     = 0x00
    , EDIT_SHEETS              = 0x01
    , MANAGE_SHEETS            = 0x02
    , INVITE_USERS             = 0x10
    , EXPULSE_USERS            = 0x20
    , MANAGE_USERS_PERMISSIONS = 0x40
    , MANAGE_HUB_SETTINGS      = 0x100

  // Permission groups
  var SHEET_ACTIONS       = 0x10 - 1
    , PARTICIPANT_ACTIONS = 0x100 - 1
    , HUB_ACTIONS         = 0x1000 - 1
    , ALL                 = 0x10000 - 1

  var Permission = function(value) {
    this.value = value;
  }

  var Constructor = function(param) {
    var value = parseInt(param);
    if (!_.isFinite(value)) {
      throw "Cannot instantiate a permissions object without a valid number."
    }
    return new Permission(parseInt(param));
  };

  Permission.prototype = {
    canEditSheet: function() {
      return (this.value & EDIT_SHEETS) > 0 ? true : false;
    },

    canManageSheets: function() {
      return (this.value & MANAGE_SHEETS) > 0 ? true : false;
    },

    canInviteUsers: function() {
      return (this.value & INVITE_USERS) > 0 ? true : false;
    },

    canExpulseUsers: function() {
      return (this.value & EXPULSE_USERS) > 0 ? true : false;
    },

    canManageUserPermissions: function() {
      return (this.value & MANAGE_USERS_PERMISSIONS) > 0 ? true : false;
    },

    canChangeHubSettings: function() {
      return (this.value & MANAGE_HUB_SETTINGS) > 0 ? true : false;
    }
  }

  var Ranks = {
    peasant: NONE,
    citizen: EDIT_SHEETS,
    duke: SHEET_ACTIONS,
    lord: SHEET_ACTIONS | INVITE_USERS,
    king: PARTICIPANT_ACTIONS - MANAGE_USERS_PERMISSIONS,
    god : HUB_ACTIONS
  }

  module.exports = Constructor;
  module.exports.class = Permission;
  module.exports.Ranks = Ranks;

}())
