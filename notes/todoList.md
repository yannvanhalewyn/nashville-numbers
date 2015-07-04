TODOLIST
========

ShortTerm
---------
TODO Make tabbing through append new bars if needed
TODO Chord spacing (should be straight forward)
TODO Deleting bar should select the previous one
  -- Maybe add a prop for focus

Before deployment
-----------------
- Set autoindexing to false for mongoose models (http://mongoosejs.com/docs/guide.html)

TIPS
====

- Define virtual accessors on MongooseShemas. Ex:
  someSchema.virtual('name.full').get(function() {
    return this.name.first + " " + this.name.last;
  });

- Add valiator for JSON sheet data. Or maybe just DONT update if invalid
  Sheet(model).schema.path('data').validate(function(value) {
    // Test for valid JSON, return true/false
  }, 'corrupt');

