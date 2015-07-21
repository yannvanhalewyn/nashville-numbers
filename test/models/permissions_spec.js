var include         = require('include')
  , expect          = require('chai').expect
  , Permission      = include('/models/permission')
  , PermissionClass = Permission.class
  , Ranks           = Permission.Ranks

describe('Permissions', function() {
  describe('constructor', function() {
    context("when instantiated with a number", function() {
      it("returns an instance of Permission with the correct value property", function() {
        var permission = Permission(7);
        expect(permission).to.be.an.instanceof(PermissionClass);
      });
    }); // End of context 'when instantiated with a number'

    context("when instantiated with a number as string", function() {
      it("returns an instance of Permission with the parsed string value", function() {
        var permission = Permission('7');
        expect(permission).to.be.an.instanceof(PermissionClass);
        expect(permission.value).to.eql(7);
      });
    }); // End of context 'when instantiated with a number as string'

    context("when instantiated with NaN", function() {
      it("throws an error", function() {
        expect(Permission.bind(null, "invalid")).to.throw("Cannot instantiate a permissions object without a valid number.");
      });
    }); // End of context 'when instantiated with NaN'
  }); // End of describe 'constructor'

/*
 * =================
 * Prototype Methods
 * =================
 */
  describe('#canEditSheet', function() {
    context("when citizen", function() {
      it("returns true (1)", function() {
        var permission = Permission(Ranks.citizen);
        expect(permission.canEditSheet()).to.be.true;
      });
    }); // End of context 'when citizen'

    context("when peasant", function() {
      it("returns false (1)", function() {
        var permission = Permission(Ranks.peasant);
        expect(permission.canEditSheet()).to.be.false;
      });
    }); // End of context 'when peasant'
  }); // End of describe '#canEditSheet'

  describe('#canManageSheets', function() {
    context("when duke", function() {
      it("returns true (2)", function() {
        var permission = Permission(Ranks.duke);
        expect(permission.canManageSheets()).to.be.true;
      });
    }); // End of context 'when duke'

    context("below duke", function() {
      it("returns false (2)", function() {
        var permission = Permission(Ranks.citizen);
        expect(permission.canManageSheets()).to.be.false;
      });
    }); // End of context 'when below duke'
  }); // End of describe '#canManageSheets'

  describe("canInviteUsers", function() {
    context("when lord", function() {
      it("returns true (3)", function() {
        var permission = Permission(Ranks.lord);
        expect(permission.canInviteUsers()).to.be.true;
      });
    }); // End of context 'when lord'

    context("when below lord", function() {
      it("returns false (3)", function() {
        var permission = Permission(Ranks.duke);
        expect(permission.canInviteUsers()).to.be.false;
      });
    }); // End of context 'when below lord'
  }); // End of context 'canInviteUsers'

  describe("canExpulseUsers", function() {
    context("when king", function() {
      it("returns true (4)", function() {
        var permission = Permission(Ranks.king);
        expect(permission.canExpulseUsers()).to.be.true;
      });
    }); // End of context 'when king'

    context("when below king", function() {
      it("returns false (4)", function() {
        var permission = Permission(Ranks.lord);
        expect(permission.canExpulseUsers()).to.be.false;
      });
    }); // End of context 'when below King'
  }); // End of context 'canExpulseUsers'

  describe("canManageUserPermissions", function() {
    context("when god", function() {
      it("returns true (5)", function() {
        var permission = Permission(Ranks.god);
        expect(permission.canManageUserPermissions()).to.be.true;
      });
    }); // End of context 'when god'

    context("when below god", function() {
      it("returns false (5)", function() {
        var permission = Permission(Ranks.king);
        expect(permission.canManageUserPermissions()).to.be.false;
      });
    }); // End of context 'when below god'
  }); // End of context 'canManageUserPermissions'

  describe('canChangeHubSettings', function() {
    context("when god", function() {
      it("returns true (6)", function() {
        var permission = Permission(Ranks.god);
        expect(permission.canChangeHubSettings()).to.be.true;
      });
    }); // End of context 'when god'

    context("when below god", function() {
      it("returns false (6)", function() {
        var permission = Permission(Ranks.king);
        expect(permission.canChangeHubSettings()).to.be.false;
      });
    }); // End of context 'when below god'
  }); // End of describe 'canManageHubSettings'
}); // End of describe 'Permissions'

