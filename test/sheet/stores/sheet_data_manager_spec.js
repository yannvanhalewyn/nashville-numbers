var expect = require('chai').expect;
var _ = require('underscore');
var DataManager = require('../../../app/sheet/stores/sheetStoreDataManager');

var DEFAULT_NUM_BARS_IN_ROW = 4;

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

/*
 * ==============
 *     addChord()
 * ==============
 */
    describe('#addChord()', function() {
      context('when existing barID is given', function() {
        context('when no chordID is given', function() {
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

/*
 * ============
 *     addBar()
 * ============
 */
    describe('#addBar()', function() {
      context('when existing rowID is given', function() {
        context('when no barID is given', function() {
          beforeEach(function() {
            DataManager.addBar('row1');
          });

          it ('adds a bar to the entities', function() {
            var barCount = _.size(data().entities.bars);
            var originalBarCount = _.size(originalData().entities.bars);
            expect(barCount).to.eql(originalBarCount + 1);
          });

          it('inserts a bar at the end of the given row', function() {
            newID = _.last(data().entities.rows['row1'].bars);
            expect(data().entities.rows['row1'].bars).to.eql(
                                        ['bar1', 'bar2', newID])
          });

          it('adds a new chord', function() {
            var chordCount = _.size(data().entities.chords);
            var originalChordCount = _.size(originalData().entities.chords);
            expect(chordCount).to.eql(originalChordCount + 1);
          });

          it('adds that chord to the new bar', function() {
            newID = _.last(data().entities.rows['row1'].bars);
            expect(data().entities.bars[newID].chords.length).to.eql(1);
          });
        });

        context('when barID is given', function() {
          context('when barID is valid', function() {
            it('inserts a new bar in row at the correct index', function() {
              DataManager.addBar('row1', 'bar1');
              addedBarID = _.last(_.keys(data().entities.bars));
              var index = data().entities.rows['row1'].bars.indexOf(addedBarID);
              expect(index).to.eql(1);
            });
          })

          context('when barID is invalid', function() {
            it('appends a new bar at the end of the row', function() {
              DataManager.addBar('row1', 'invalid');
              addedBarID = _.last(_.keys(data().entities.bars));
              expect(data().entities.rows['row1'].bars).to.eql(
                          ['bar1', 'bar2', addedBarID]);
            });
          });
        });
      });

      context('when invalid rowID is given', function() {
        beforeEach(function() {
          DataManager.addBar('invalid');
        });

        it("doesn't add a bar entity", function() {
          var barCount = _.size(data().entities.bars);
          var originalBarCount = _.size(originalData().entities.bars);
          expect(barCount).to.eql(originalBarCount);
        });

        it("doesn't create the missing row", function() {
          expect(data().entities.rows['invalid']).to.be.undefined;
        });
      });
    });

/*
 * ============
 *     addRow()
 * ============
 */
    describe('#addRow()', function() {
      context('when existing sectionID is given', function() {
        context('when no rowID is given', function() {
          beforeEach(function() {
            DataManager.addRow('section1');
          });

          it ('adds a row to the entities', function() {
            var rowCount = _.size(data().entities.rows);
            var originalRowCount = _.size(originalData().entities.rows);
            expect(rowCount).to.eql(originalRowCount + 1);
          });

          it('inserts a row at the end of the given section', function() {
            newID = _.last(data().entities.sections['section1'].rows);
            expect(data().entities.sections['section1'].rows).to.eql(
                                        ['row1', 'row2', newID])
          });

          it('adds DEFAULT_NUM_BARS_IN_ROW bar entities ', function() {
            var barCount = _.size(data().entities.bars);
            var originalBarCount = _.size(originalData().entities.bars);
            expect(barCount).to.eql(originalBarCount + DEFAULT_NUM_BARS_IN_ROW);
          });

          it('adds those bars to the row', function() {
            newID = _.last(data().entities.sections['section1'].rows);
            expect(data().entities.rows[newID].bars.length).to.eql(DEFAULT_NUM_BARS_IN_ROW);
          });
        });

        context('when rowID is given', function() {
          context('when rowID is valid', function() {
            it('inserts a new row in section at the correct index', function() {
              DataManager.addRow('section1', 'row1');
              addedRowID = _.last(_.keys(data().entities.rows));
              var index = data().entities.sections['section1'].rows.indexOf(addedRowID);
              expect(index).to.eql(1);
            });
          });

          context('when rowID is invalid', function() {
            it('appends a new row at the end of the section', function() {
              DataManager.addRow('section1', 'invalid');
              addedRowID = _.last(_.keys(data().entities.rows));
              expect(data().entities.sections['section1'].rows).to.eql(
                          ['row1', 'row2', addedRowID]);
            });
          });
        });
      });

      context('when invalid sectionID is given', function() {
        beforeEach(function() {
          DataManager.addRow('invalid');
        });

        it("doesn't add a row entity", function() {
          var rowCount = _.size(data().entities.rows);
          var originalRowCount = _.size(originalData().entities.rows);
          expect(rowCount).to.eql(originalRowCount);
        });

        it("doesn't create the missing section", function() {
          expect(data().entities.sections['invalid']).to.be.undefined;
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
    entities: {
      sections: {
        section1: {
          id: "section1",
          name: "intro",
          rows: [
            "row1",
            "row2",
          ]
        },
        section2: {
          id: "section2",
          name: "verse",
          rows: [
            "row3"
          ]
        }
      },
      rows: {
        row1: {
          id: "row1",
          bars: [
            "bar1",
            "bar2"
          ]
        },
        row2: {
          id: "row2",
          bars: [
            "bar3"
          ]
        },
        row3: {
          id: "row3",
          bars: [
            "bar4"
          ]
        }
      },
      bars: {
        bar1: {
          id: "bar1",
          chords: [
            "chord1",
            "chord2"
          ]
        },
        bar2: {
          id: "bar1",
          chords: [
            "chord3",
            "chord4"
          ]
        },
        bar3: {
          id: "bar3",
          chords: [
            "chord5"
          ]
        },
        bar4: {
          id: "bar4",
          chords: [
            "chord6"
          ]
        }
      },
      chords: {
        chord1: {
          id: "chord1",
          raw: "chord1-raw"
        },
        chord2: {
          id: "chord2",
          raw: "chord2-raw"
        },
        chord3: {
          id: "chord3",
          raw: "chord3-raw"
        },
        chord4: {
          id: "chord4",
          raw: "chord4-raw"
        },
        chord5: {
          id: "chord5",
          raw: "chord5-raw"
        },
        chord6: {
          id: "chord6",
          raw: "chord6-raw"
        }
      }
    },
    result: {
      title: "theTitle",
      artist: "theArtist",
      sections: [
        "section1"
      ]
    }
  }
}
