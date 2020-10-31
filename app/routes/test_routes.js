////////////////////////////////////////////////////////////////////////////////
//
// test_routes.js
//
// This defines the Express.js routes for CRUD operations for tests.
//
////////////////////////////////////////////////////////////////////////////////




// Express docs: http://expressjs.com/en/api.html
const express = require('express');

// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport');

// pull in Mongoose model for examples
const Test = require('../models/test');

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors');

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;

// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields');

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();


////////// ROUTES //////////


// CREATE
// POST /tests
// TODO: REMOVE COMMENT FOR REQUIRETOKEN.
router.post('/tests', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.owner = req.user.id;

  Test.create(req.body)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(test => {
      res.status(201).json({ test: test.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
});


// INDEX
// GET /examples
// TODO: REMOVE COMMENT FOR REQUIRETOKEN.
router.get('/tests/', requireToken, (req, res, next) => {
  
  Test.find()
    .then(tests => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return tests.map(test => test.toObject());
    })
    // respond with status 200 and JSON of the examples
    .then(tests => res.status(200).json({ tests: tests }))
    // if an error occurs, pass it to the handler
    .catch(next);
});


router.get('/tests/mytests/:email', requireToken, (req, res, next) => {
  
  const email = req.params.email;

  Test.find()
    .populate('owner')
    .then(tests => {
      return tests.map(test => test.toObject());
    })
    // Now that we have PJOJs, we can filter on email 
    // adress.
    .then(tests => {
      return tests.filter(test => test.owner.email === email)
    })
    // respond with status 200 and JSON of the examples
    .then(tests => res.status(200).json({ tests: tests }))
    // if an error occurs, pass it to the handler
    .catch(next);
});


// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
// TODO: REMOVE COMMENT FOR REQUIRETOKEN.
router.get('/tests/:id', /*requireToken,*/ (req, res, next) => {
  
  // req.params.id will be set based on the `:id` in the route
  Test.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(test => res.status(200).json({ test: test.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next);
});


// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
// TODO: REMOVE COMMENT FOR REQUIRETOKEN.
router.patch('/tests/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  //req.body.owner = req.user.id

  Test.findById(req.params.id)
    .then(handle404)
    .then(test => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      // TODO: REMOVE COMMENT BEFORE FLIGHT.
      requireOwnership(req, test);

      // pass the result of Mongoose's `.update` to the next `.then`
      return test.updateOne(req.body);
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});


// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
// TODO: REMOVE COMMENT FOR REQUIRETOKEN.
router.delete('/tests/:id', /*requireToken,*/ (req, res, next) => {
  Test.findById(req.params.id)
    .then(handle404)
    .then(test => {
      // throw an error if current user doesn't own `example`
      //requireOwnership(req, example)
      // delete the example ONLY IF the above didn't throw
      test.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});


module.exports = router;
