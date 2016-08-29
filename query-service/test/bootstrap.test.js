var sails = require('sails'),
  chai = require('chai');

var Video = require('replay-schemas/Video'),
  VideoMetadata = require('replay-schemas/VideoMetadata'),
  Query = require('replay-schemas/Query'),
  StreamingSource = require('replay-schemas/StreamingSource');

// config chai
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

// called before each and every test
beforeEach(function(){
  return wipeMongoCollections();
});

// called after each and every test
afterEach(function(){
  return wipeMongoCollections();
});

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(8000);

  sails.lift({
    // configuration for testing purposes
    environment: 'testing',
    hooks: { grunt: false }
  }, function(err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

// wipe mongo collections
function wipeMongoCollections() {
	return Video.remove({})
		.then(() => VideoMetadata.remove({}))
		.then(() => Query.remove({}))
    .then(() => StreamingSource.remove({}));
};