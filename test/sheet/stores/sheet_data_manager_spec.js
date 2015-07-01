var expect = require('chai').expect;
var _ = require('underscore');
var DataManager = require('../../../app/sheet/stores/sheetStoreDataManager');

describe('SheetStoreDataManager', function() {

  describe('#set/getData()', function() {
    it('is empty on start', function() {
      expect(DataManager.getData().size).to.eql(0);
    });

    it('stores the data', function() {
      DataManager.setData({foo: "bar"});
      var res = DataManager.getData();
      expect(res.size).to.eql(1);
      expect(res.get('foo')).to.eql("bar");
    })
  });

  describe('managing data', function() {
    beforeEach(function() {
      DataManager.setData(originalData());
    });

    describe('#updateChordText()', function() {
      it('stores the new text in the correct chord', function() {
        DataManager.updateChordText('chord3', "popo");
        expect(data().entities.chords['chord3'].raw).to.eql('popo');
      });

      it("doesn't store a new chord when id is unexistant", function() {
        DataManager.updateChordText('invalid', "popo");
        expect(data().entities.chords['invalid']).to.be.undefined;
      });
    });

    describe('#appendChord()', function() {
      context('when no chordID is given', function() {
        context('when existing barID is given', function() {
          beforeEach(function() {
            DataManager.addChord('bar2');
          });

          it ('adds a chord to the entities', function() {
            var chordCount = _.size(data().entities.chords);
            var originalChordCount = _.size(originalData().entities.chords);
            expect(chordCount).to.eql(originalChordCount + 1);
          });

          it('inserts a chord at the end of the given bar', function() {
            var chordsInBar = data().entities.bars['bar2'].chords;
            var newID = chordsInBar[chordsInBar.length - 1];
            expect(data().entities.bars['bar2'].chords).to.eql(
                                        ['chord3', 'chord4', newID])
          });
        });

        context('when invalid barID is given', function() {
          beforeEach(function() {
            DataManager.addChord('invalid');
          });

          it("doesn't add a chord entity", function() {
            var chordCount = _.size(data().entities.chords);
            var originalChordCount = _.size(originalData().entities.chords);
            expect(chordCount).to.eql(originalChordCount);
          });

          it("doesn't create the missing bar", function() {
            expect(data().entities.bars['invalid']).to.be.undefined;
          });
        });
      });

      context('when chordID is given', function() {
        context('when chordID is valid', function() {
          it('inserts a new chord in bar at the correct index', function() {
            DataManager.addChord('bar1', 'chord1');
            addedChordID = _.last(_.keys(data().entities.chords));
            var index = data().entities.bars['bar1'].chords.indexOf(addedChordID);
            expect(index).to.eql(1);
          });
        })

        context('when chordID is invalid', function() {
          it('appends a new chord at the end of the bar', function() {
            DataManager.addChord('bar1', 'invalid');
            addedChordID = _.last(_.keys(data().entities.chords));
            expect(data().entities.bars['bar1'].chords).to.eql(
                        ['chord1', 'chord2', addedChordID]);
          });
        });
      });

    });

  });
});

function data() {
  return DataManager.getData().toJS();
}

function originalData() {
  return {
    "entities": {
      "sections": {
        "section1": {
          "id": "section1",
          "name": "intro",
          "rows": [
            "row1"
          ]
        }
      },
      "rows": {
        "row1": {
          "id": "row1",
          "bars": [
            "bar1",
            "bar2"
          ]
        }
      },
      "bars": {
        "bar1": {
          "id": "bar1",
          "chords": [
            "chord1",
            "chord2"
          ]
        },
        "bar2": {
          "id": "bar1",
          "chords": [
            "chord3",
            "chord4"
          ]
        }
      },
      "chords": {
        "chord1": {
          "id": "chord1",
          "raw": "chord1-raw"
        },
        "chord2": {
          "id": "chord2",
          "raw": "chord2-raw"
        },
        "chord3": {
          "id": "chord3",
          "raw": "chord3-raw"
        },
        "chord4": {
          "id": "chord4",
          "raw": "chord4-raw"
        }
      }
    },
    "result": {
      "title": "theTitle",
      "artist": "theArtist",
      "sections": [
        "section1"
      ]
    }
  }
}
