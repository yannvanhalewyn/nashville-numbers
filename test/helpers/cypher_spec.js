var include = require('include')
  , expect  = require('chai').expect
  , Cypher  = include('/helpers/cypher')

describe('CYPHER', function() {
  describe('#match()', function() {
    context("when no params are given", function() {
      it("returns MATCH (l:Labelname)", function() {
        expect(Cypher.match('p', 'Person')).to.eql("MATCH (p:Person) ")
      });
    }); // End of context 'when one param is given'

    context("when one param is given", function() {
      it("returns MATCH (l:label {param: {param}})", function() {
        expect(Cypher.match('p', 'Person', {name: "Yann"})).to.eql(
          "MATCH (p:Person{name:{name}}) "
        );
      });

      context("when many params are given", function() {
        it("returns an valid string containing every param", function() {
          expect(Cypher.match('p', 'Person', {
            name: "foo", lastName: "bar", age: 23
          })).to.eql("MATCH (p:Person{name:{name},lastName:{lastName},age:{age}}) ");
        });
      }); // End of context 'when many params are given'
    }); // End of context 'when '
  }); // End of describe '#match()'

  describe('#where()', function() {
    it("returns WHERE id(x) = {propname}", function() {
      expect(Cypher.whereIdIs('p', 'user_id')).to.eql("WHERE id(p) = {user_id} ");
    });
  }); // End of describe 'when'

  describe('#set()', function() {
    it("returns SET s.xx = yy ", function() {
      expect(Cypher.set('x', {title: "newTitle", artist: "newArtist"})).to.eql(
        "SET x.title = 'newTitle',x.artist = 'newArtist' "
      );
    });

    context("when a param is a number", function() {
      it("doesn't surround the value with quotes", function() {
        expect(Cypher.set('p', {name: "Fred", age: 23})).to.eql(
          "SET p.name = 'Fred',p.age = 23 "
        );
      });
    }); // End of context 'when a param is a number'
  }); // End of describe '#set()'

}); // End of describe 'CYPHER'
