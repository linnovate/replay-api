var sails = require('sails'),
  chai = require('chai');

var utils = require('./utils');

var Mission = require('replay-schemas/Mission'),
  User = require('replay-schemas/User'),
  VideoMetadata = require('replay-schemas/VideoMetadata'),
  Query = require('replay-schemas/Query'),
  Tag = require('replay-schemas/Tag'),
  StreamingSource = require('replay-schemas/StreamingSource');

// config chai
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

// called before each and every test
beforeEach(function () {
  return wipeMongoCollections();
});

// called after each and every test
afterEach(function () {
  return wipeMongoCollections();
});

before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(8000);

  sails.lift({
    // configuration for testing purposes
    environment: 'testing',
    hooks: { grunt: false }
  }, function (err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    utils.createUser()
      .then(utils.mockAuthorizationService)
      .then(() => done(err, sails))
      .catch(err => {
        if (err) {
          console.log('Error initializing tests.');
          done(err);
        }
      })
  });
});

after(function (done) {
  // here you can clear fixtures, etc.
  wipeUserCollection()
    .then(() => {
      sails.lower(done);
      return Promise.resolve();
    })
    .catch(err => {
      if (err) {
        console.log('Failed cleaning after tests.');
        done(err);
      }
    })
});

// wipe mongo collections
function wipeMongoCollections() {
  return Mission.remove({})
    .then(() => VideoMetadata.remove({}))
    .then(() => Query.remove({}))
    .then(() => StreamingSource.remove({}))
    .then(() => Tag.remove({}));
};

// user for mocking authentication, therefore needs to be wiped only at the end
function wipeUserCollection() {
  return User.remove({});
}


