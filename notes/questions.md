QUESTIONS
=========

ROUTING
-------
- For the sheets route, is it better to do
  /sheets/:id and figure out who the owner is in the controller
  or is there massive gain on using
  /users/:uid/sheets/:sid to already have that information
  maybe add :uid in the request body
  maybe have both, the display link is /sheets/:id,
  but the buttons that link to a sheet are /users/:uid/sheets/:sid or something

MODELS
------
- mongo storing sheet data as raw JSON string? or as an embeded document
- mongo friendship model : add a collection?
- mongo sheets model : authorID in sheet or sheetID in user? or both?
  Both might seem better, beacause these are values that rarely (as in only on
  instatiation/deletion) get updated, but get read all the time.

CONTROLLERS
-----------
- Do I need to check for req.user in controller (sheet for example) methods?
  Middleware is redirecting if not logged in, but if I don't do any checks in
  the controller, the controller feels naked and exposed.
- When a user goes to a public /sheet/:id of another user. Should I render
  another view, or the same view, but with a flag saying "read-only", as in
  have the display logic on the front-end
- Where to redirect to when. Ex: When sheetID is not found, redirect to /sheets,
  when sheetID is private and your not the owner, redirect to explore?
  when do I return a 403? I don't want the user to see that stuff.

TESTING
-------
- How do you test multiple params with multiple possiblities? For example, the
  SHEET#show route comes with 2 params. They can each be either valid, invalid
  or absent. Do you create the 9 tests with darn nested blocks and repetitiion?
    describe the route
      - when a is valid
        - when b is valid
        - when b is invalid
        - when b is missing
      -when a is invalid
        - when b is valid
        - when b is invalid
        - when b is missing
        [etc..]
